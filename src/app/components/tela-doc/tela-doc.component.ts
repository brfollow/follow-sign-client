import { Component } from '@angular/core';
import { isEmpty, tap } from 'rxjs';
import { DocModel } from 'src/app/model/docModel';
import { SenderModel } from 'src/app/model/senderModel';
import { UserModel } from 'src/app/model/userModel';
import { AssinaturaService } from 'src/app/service/assinatura.service';
import { DadosService } from 'src/app/service/dadosService.service';

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
  resultadoVerificacao: boolean = true;


  assinaturaImg: string = this.assinaturaService.getImageDataURL()
  assinaturaTxt: string = this.assinaturaService.getAssinaturaTxt()

  constructor(private dadosService: DadosService, private assinaturaService:AssinaturaService) {}

  ngOnInit(): void {

  
    


   this.verificarassinatura()

   this.dadosService.getData().subscribe((dados) => {

    this.user = this.dadosService.mapToUser(dados);
    this.sender = this.dadosService.mapToSender(dados);
    this.docModel = this.dadosService.mapToDoc(dados);
    
     

});

    
  }

  verificarassinatura(){

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


}
