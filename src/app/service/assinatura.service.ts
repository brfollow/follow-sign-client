import { Injectable } from '@angular/core';
import { DadosService } from './dadosService.service';




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
    console.log(this.assinaturaTxt );
   
  }

  getAssinaturaTxt() {

   return this.assinaturaTxt; 

   
  }






}
