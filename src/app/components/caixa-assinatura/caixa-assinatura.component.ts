import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { AssinaturaService } from 'src/app/service/assinatura.service';
import { DadosService } from 'src/app/service/dadosService.service';

@Component({
  selector: 'app-caixa-assinatura',
  templateUrl: './caixa-assinatura.component.html',
  styleUrls: ['./caixa-assinatura.component.css',
  './caixa-assinatura.responsive.component.css'
]
})
export class CaixaAssinaturaComponent {

  @Input()
  alturaCanvas: string = ''
  @Input()
  larguraCanvas:string =''

  statusAssinatura: boolean = false



  @ViewChild('signatureCanvas', { static: true }) signatureCanvas!: ElementRef<HTMLCanvasElement>;

  private context!: CanvasRenderingContext2D;
  private paths: Array<Array<{ x: number; y: number }>> = [];
  private undoStack: Array<Array<{ x: number; y: number }>> = [];
  private isDrawing = false;

  constructor( private assinaturaService: AssinaturaService) {}

  ngAfterViewInit(): void {
    const canvas = this.signatureCanvas.nativeElement;
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
  
    if (!this.context) {
      console.error('Erro ao obter o contexto 2D do canvas.');
    }
  
    canvas.addEventListener('pointerdown', this.handleStart.bind(this));
    canvas.addEventListener('pointermove', this.handleMove.bind(this));
    canvas.addEventListener('pointerup', this.stopDrawing.bind(this));
    canvas.addEventListener('pointercancel', this.stopDrawing.bind(this));
  }  
  
  handleStart(e: PointerEvent): void {
    e.preventDefault();
  
    this.isDrawing = true;
    this.paths.push([]);
    this.draw(e);
  }
  
  handleMove(e: PointerEvent): void {
    e.preventDefault();
  
    if (this.isDrawing) {
      this.draw(e);
    }
  }

  stopDrawing(): void {
    this.isDrawing = false;
  }
  draw(e: PointerEvent): void {
    this.statusAssinatura = true;
    const currentPath = this.paths[this.paths.length - 1];
  
    this.context.lineWidth = 2;
    this.context.lineCap = 'round';
    this.context.strokeStyle = '#000';
  
    const offsetX = e.offsetX !== undefined ? e.offsetX : (e.pageX - this.signatureCanvas.nativeElement.getBoundingClientRect().left);
    const offsetY = e.offsetY !== undefined ? e.offsetY : (e.pageY - this.signatureCanvas.nativeElement.getBoundingClientRect().top);
  
    currentPath.push({ x: offsetX, y: offsetY });
  
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

    if(this.paths.length == 0){
      this.statusAssinatura =false
    }
  }

 
  clearDrawing(): void {
    this.context.clearRect(0, 0, this.signatureCanvas.nativeElement.width, this.signatureCanvas.nativeElement.height);
    this.paths.length = 0;

    this.statusAssinatura =false
  }




  downloadDrawing() {
    if (this.paths.length > 0) {
      const dataURL = this.signatureCanvas.nativeElement.toDataURL('image/png');
    
     
      
      this.assinaturaService.setImageDataURL(dataURL);

    

     
    
    } else {
   
      alert('Sem assinatura.');
    }
  }




 




}
