import { Component } from '@angular/core';
import { isEmpty, tap } from 'rxjs';
import { DocModel } from 'src/app/model/docModel';
import { SenderModel } from 'src/app/model/senderModel';
import { UserModel } from 'src/app/model/userModel';
import { AssinaturaService } from 'src/app/service/assinatura.service';
import { DadosService } from 'src/app/service/dadosService.service';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-tela-doc',
  templateUrl: './tela-doc.component.html',
  styleUrls: ['./tela-doc.component.css',
  './tela-doc.responsive.component.css']
})
export class TelaDocComponent {



  user!: UserModel ;
  sender!: SenderModel;
  docModel!:DocModel;

 

  isSigned: boolean = false;
  
  botaoDownload: boolean = false;


  assinaturaImg: string = this.assinaturaService.getImageDataURL()
  assinaturaTxt: string = this.assinaturaService.getAssinaturaTxt()

  

  constructor(private dadosService: DadosService, private assinaturaService:AssinaturaService) {}

  ngOnInit(): void {

  
  console.log("img "+this.assinaturaImg);
  console.log("txt "+this.assinaturaTxt);


   this.verificarAssinatura()

   this.dadosService.getData().subscribe((dados) => {

    this.user = this.dadosService.mapToUser(dados);
    this.sender = this.dadosService.mapToSender(dados);
    this.docModel = this.dadosService.mapToDoc(dados);
    
     

});




    
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

  showDonload(){
    this.botaoDownload = true
  }



  gerarPdf(){
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Documento Assinado",
      showConfirmButton: false,
      timer: 3000
    });
   
    this.showDonload()
  }


  // gerarPDF() {
  //   const options = {
  //     margin: 10,
  //     filename: 'documento.pdf',
  //     image: { type: 'jpeg', quality: 0.98 },
  //     html2canvas: { scale: 2 },
  //     jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  //   };

  //   const conteudo = this.conteudoHTML.nativeElement;

  //   html2pdf()
  //     .from(conteudo)
  //     .set(options)
  //     .outputPdf(pdf => {
  //       // Aqui você pode salvar o PDF ou enviar para algum serviço, por exemplo.
  //       console.log('PDF gerado:', pdf);
  //     });
  // }

}
