import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { AssinaturaService } from 'src/app/service/assinatura.service';
import { DadosService } from 'src/app/service/dadosService.service';

@Component({
  selector: 'app-caixa-assinatura',
  templateUrl: './caixa-assinatura.component.html',
  styleUrls: ['./caixa-assinatura.component.css']
})
export class CaixaAssinaturaComponent {

  @Input()
  alturaCanvas: string = ''
  @Input()
  larguraCanvas:string =''



  @ViewChild('signatureCanvas', { static: true }) signatureCanvas!: ElementRef<HTMLCanvasElement>;

  private context!: CanvasRenderingContext2D;
  private paths: Array<Array<{ x: number; y: number }>> = [];
  private undoStack: Array<Array<{ x: number; y: number }>> = [];
  private isDrawing = false;

  constructor(private renderer: Renderer2, private dadosService: DadosService, private assinaturaService: AssinaturaService) {}

  ngAfterViewInit(): void {
    const canvas = this.signatureCanvas.nativeElement;
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
  
    if (!this.context) {
      console.error('Erro ao obter o contexto 2D do canvas.');
    }
  
    canvas.addEventListener('mousedown', this.handleStart.bind(this));
    canvas.addEventListener('touchstart', this.handleStart.bind(this));
  
    canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
    canvas.addEventListener('mouseleave', this.stopDrawing.bind(this));
    canvas.addEventListener('touchend', this.stopDrawing.bind(this));
    canvas.addEventListener('touchcancel', this.stopDrawing.bind(this));
  
    canvas.addEventListener('mousemove', this.handleMove.bind(this));
    canvas.addEventListener('touchmove', this.handleMove.bind(this));
  }
  
  handleStart(e: MouseEvent | TouchEvent): void {
    e.preventDefault();
  
    const event = e instanceof TouchEvent ? (e.touches[0] || e.changedTouches[0]) : e;
    this.isDrawing = true;
    this.paths.push([]);
    this.draw(event);
  }
  
  handleMove(e: MouseEvent | TouchEvent): void {
    e.preventDefault();
  
    if (this.isDrawing) {
      const event = e instanceof TouchEvent ? (e.touches[0] || e.changedTouches[0]) : e;
      this.draw(event);
    }
  }



  stopDrawing(): void {
    this.isDrawing = false;
  }
  draw(e: MouseEvent | Touch): void {
    const currentPath = this.paths[this.paths.length - 1];
  
    this.context.lineWidth = 2;
    this.context.lineCap = 'round';
    this.context.strokeStyle = '#000';
    
    currentPath.push({ x: e.clientX - this.signatureCanvas.nativeElement.getBoundingClientRect().left, y: e.clientY - this.signatureCanvas.nativeElement.getBoundingClientRect().top });
  
    this.context.clearRect(0, 0, this.signatureCanvas.nativeElement.width, this.signatureCanvas.nativeElement.height);
  
    this.paths.forEach(path => {
      this.context.beginPath();
      this.context.moveTo(path[0].x, path[0].y);
  
      path.forEach(point => {
        this.context.lineTo(point.x, point.y);
      });
  
      this.context.stroke();
    });
  }
  undoDrawing(): void {
    if (this.paths.length > 0) {
      const undonePath = this.paths.pop() || [];
      this.undoStack.push(undonePath);

      this.context.clearRect(0, 0, this.signatureCanvas.nativeElement.width, this.signatureCanvas.nativeElement.height);

      this.paths.forEach(path => {
        this.context.beginPath();
        this.context.moveTo(path[0].x, path[0].y);

        path.forEach(point => {
          this.context.lineTo(point.x, point.y);
        });

        this.context.stroke();
      });
    }
  }

 
  clearDrawing(): void {
    this.context.clearRect(0, 0, this.signatureCanvas.nativeElement.width, this.signatureCanvas.nativeElement.height);
    this.paths.length = 0;
  }




  downloadDrawing() {
    if (this.paths.length > 0) {
      const dataURL = this.signatureCanvas.nativeElement.toDataURL('image/png');
    
     
      
      this.assinaturaService.setImageDataURL(dataURL);

     
      
      // const a = document.createElement('a');
      // a.href = dataURL;
      // a.download = 'assinatura.png';
      // document.body.appendChild(a);
      // a.click();
      // document.body.removeChild(a);
    } else {
      alert('Nenhum desenho para baixar.');
    }
  }




 




}
