// tela-assinatura.component.ts
import { Component, ElementRef, ViewChild} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';






@Component({
  selector: 'app-tela-assinatura',
  templateUrl: './tela-assinatura.component.html',
  styleUrls: ['./tela-assinatura.component.css'],
})
export class TelaAssinaturaComponent{

 
  modoAssinatura: boolean = true




  trocaMode(estadoAtual:boolean){
    
    this.modoAssinatura = !estadoAtual 
   
  }

 

 
}
