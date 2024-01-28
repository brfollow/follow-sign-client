import { Injectable } from '@angular/core';


import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AssinaturaService {

  constructor() { }

 


  private assinaturaImg: string = ''
  private assinaturaTxt: string = ''



  setImageDataURL(dataURL: string) {
   
    
    this.assinaturaImg = dataURL;
 
   
  }

  getImageDataURL() {

   return this.assinaturaImg; 

   
  }


  setAssinaturaTxt(txt: string) {

    this.assinaturaTxt = txt;
   
   
  }

  getAssinaturaTxt() {

   return this.assinaturaTxt; 

   
  }



  private conteudoParaPDFSource = new BehaviorSubject<string>('');
  conteudoParaPDF$ = this.conteudoParaPDFSource.asObservable();
  private pdfTemporario: string | null = null;

  setConteudoParaPDF(conteudo: string): void {
    this.conteudoParaPDFSource.next(conteudo);
  }

  salvarPDFTemporariamente(pdf: string): void {
    this.pdfTemporario = pdf;
  }

  obterPDFTemporario(): string | null {
    return this.pdfTemporario;
  }




}
