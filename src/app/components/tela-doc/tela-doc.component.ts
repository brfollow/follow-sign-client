import { Component, ElementRef, ViewChild } from '@angular/core';
import { DocModel } from 'src/app/model/docModel';
import { SenderModel } from 'src/app/model/senderModel';
import { UserModel } from 'src/app/model/userModel';
import { LogModel } from 'src/app/model/LogModel';

import { AssinaturaService } from 'src/app/service/assinatura.service';
import { DadosService } from 'src/app/service/dadosService.service';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2'
import jsPDF from 'jspdf';

@Component({
  selector: 'app-tela-doc',
  templateUrl: './tela-doc.component.html',
  styleUrls: ['./tela-doc.component.css',
  './tela-doc.responsive.component.css']
})
export class TelaDocComponent {
  @ViewChild('paragrafo') paragrafo!: ElementRef;
  @ViewChild('conteudoParaPDF') conteudoParaPDF!: ElementRef;

  user: UserModel | undefined ;
  sender: SenderModel | undefined;
  docModel:DocModel | undefined;

  log: LogModel | undefined;

 

  isSigned: boolean = false;
  
  botaoDownload: boolean = false;

  assinaturaConcluida: boolean = false


  assinaturaImg: string = this.assinaturaService.getImageDataURL()
  assinaturaTxt: string = this.assinaturaService.getAssinaturaTxt()

  

  constructor(private dadosService: DadosService, private assinaturaService:AssinaturaService) {}

  ngOnInit(): void {

  
   this.dadosService.getData().subscribe(async (dados) => {

    this.user = this.dadosService.mapToUser(dados);
    this.sender = this.dadosService.mapToSender(dados);
    this.docModel = await this.dadosService.mapToDoc(dados);
    
     

});



 this.verificarAssinatura()


    
}




  verificarAssinatura(){

    if(this.assinaturaImg){
      this.isSigned = true
      this.assinaturaTxt = ''
            
    }else if(this.assinaturaTxt){
      this.isSigned = true
     
      this.assinaturaImg = ''

      
    
    }
  }


  limparAssinatura(){
    this.assinaturaService.setImageDataURL('')
    this.assinaturaService.setAssinaturaTxt('')
 
    
  }

  showDawnload(){
    this.botaoDownload = true
  }



  imagemGerada: string ='';


  //gerar uma imagem da assinatura que foi feita em txt
  gerarImagemTxt() {
    html2canvas(this.paragrafo.nativeElement).then((canvas) => {
      this.imagemGerada = canvas.toDataURL();
   
      
    });
  }



  concluirAssinatura(){
    this.dadosService.postDataLog().subscribe(
      (response) => {
        console.log('Log postado com sucesso:', response);
        // Lógica adicional, se necessário
      },
      (error) => {
        console.error('Erro ao postar o log:', error);
        // Lida com erros aqui, se necessário
      }
      );
    
  
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Documento Assinado",
      showConfirmButton: false,
      timer: 3000
    });


    if(this.assinaturaTxt){
      this.gerarImagemTxt()
    }
    
    this.showDawnload()
    this.assinaturaConcluida = true
  }


  gerarPDF() {

    let pdf = new jsPDF('p', 'pt', 'a4');


    pdf.html(this.conteudoParaPDF.nativeElement,{
      callback:(pdf) =>{
        pdf.save('documento.pdf');
      }
    })

 
  }


  


}
