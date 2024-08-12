import {
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { AssinaturaService } from 'src/app/service/assinatura.service';
import { DadosService } from 'src/app/service/dadosService.service';

@Component({
  selector: 'app-caixa-assinatura',
  templateUrl: './caixa-assinatura.component.html',
  styleUrls: [
    './caixa-assinatura.component.css',
    './caixa-assinatura.responsive.component.css',
  ],
})
export class CaixaAssinaturaComponent {
  @Input()
  alturaCanvas: string = '';
  @Input()
  larguraCanvas: string = '';

  statusAssinatura: boolean = false;

  @ViewChild('signatureCanvas', { static: true })
  signatureCanvas!: ElementRef<HTMLCanvasElement>;

  private context!: CanvasRenderingContext2D;
  private paths: Array<Array<{ x: number; y: number }>> = [];
  private undoStack: Array<Array<{ x: number; y: number }>> = [];
  private isDrawing = false;

  constructor(
    private renderer: Renderer2,
    private dadosService: DadosService,
    private assinaturaService: AssinaturaService,
  ) {}

  ngAfterViewInit(): void {
    const canvas = this.signatureCanvas.nativeElement;
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;

    if (!this.context) {
      console.error('Erro ao obter o contexto 2D do canvas.');
    }

    canvas.addEventListener('mousedown', (e: any) => this.handleStart(e));
    canvas.addEventListener('touchstart', (e: any) => this.handleStart(e), {
      passive: false,
    });

    canvas.addEventListener('mouseup', () => this.stopDrawing());
    canvas.addEventListener('mouseleave', () => this.stopDrawing());
    canvas.addEventListener('touchend', () => this.stopDrawing());
    canvas.addEventListener('touchcancel', () => this.stopDrawing());

    canvas.addEventListener('mousemove', (e: any) => this.handleMove(e));
    canvas.addEventListener('touchmove', (e: any) => this.handleMove(e), {
      passive: false,
    });
  }

  handleStart(e: any): void {
    e.preventDefault();
    const event = e.touches ? e.touches[0] || e.changedTouches[0] : e;
    this.isDrawing = true;
    this.paths.push([]);
    this.draw(event);
  }

  handleMove(e: any): void {
    e.preventDefault();
    if (this.isDrawing) {
      const event = e.touches ? e.touches[0] || e.changedTouches[0] : e;
      this.draw(event);
    }
  }

  stopDrawing(): void {
    this.isDrawing = false;
  }

  draw(e: MouseEvent | Touch): void {
    this.statusAssinatura = true;
    const currentPath = this.paths[this.paths.length - 1];

    this.context.lineWidth = 2;
    this.context.lineCap = 'round';
    this.context.strokeStyle = '#000';

    currentPath.push({
      x:
        e.clientX -
        this.signatureCanvas.nativeElement.getBoundingClientRect().left,
      y:
        e.clientY -
        this.signatureCanvas.nativeElement.getBoundingClientRect().top,
    });

    this.context.clearRect(
      0,
      0,
      this.signatureCanvas.nativeElement.width,
      this.signatureCanvas.nativeElement.height,
    );

    this.paths.forEach((path) => {
      this.context.beginPath();
      this.context.moveTo(path[0].x, path[0].y);

      path.forEach((point) => {
        this.context.lineTo(point.x, point.y);
      });

      this.context.stroke();
    });
  }

  undoDrawing(): void {
    if (this.paths.length > 0) {
      const undonePath = this.paths.pop() || [];
      this.undoStack.push(undonePath);

      this.context.clearRect(
        0,
        0,
        this.signatureCanvas.nativeElement.width,
        this.signatureCanvas.nativeElement.height,
      );

      this.paths.forEach((path) => {
        this.context.beginPath();
        this.context.moveTo(path[0].x, path[0].y);

        path.forEach((point) => {
          this.context.lineTo(point.x, point.y);
        });

        this.context.stroke();
      });
    }

    if (this.paths.length === 0) {
      this.statusAssinatura = false;
    }
  }

  clearDrawing(): void {
    this.context.clearRect(
      0,
      0,
      this.signatureCanvas.nativeElement.width,
      this.signatureCanvas.nativeElement.height,
    );
    this.paths.length = 0;

    this.statusAssinatura = false;
  }

  downloadDrawing() {
    if (this.paths.length > 0) {
      this.context.fillStyle = '#ffffff'; // Branco
      this.context.fillRect(
        0,
        0,
        this.signatureCanvas.nativeElement.width,
        this.signatureCanvas.nativeElement.height,
      );

      // Renderizar a assinatura
      this.paths.forEach((path) => {
        this.context.beginPath();
        this.context.moveTo(path[0].x, path[0].y);

        path.forEach((point) => {
          this.context.lineTo(point.x, point.y);
        });

        this.context.stroke();
      });

      // Obter a imagem como JPEG
      const dataURL = this.signatureCanvas.nativeElement.toDataURL(
        'image/jpeg',
        0.7,
      );

      // Restaurar o estado do canvas
      this.clearDrawing();

      this.assinaturaService.setImageDataURL(dataURL);
    } else {
      alert('Sem assinatura.');
    }
  }
}
