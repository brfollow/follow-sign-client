import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-caixa-assinatura-texto',
  templateUrl: './caixa-assinatura-texto.component.html',
  styleUrls: ['./caixa-assinatura-texto.component.css']
})
export class CaixaAssinaturaTextoComponent {

  assinaturaSalva: string = 'teste'



  limparInput(){
    this.assinaturaSalva = ''
  }
  

}
