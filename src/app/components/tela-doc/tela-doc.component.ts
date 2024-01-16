import { Component } from '@angular/core';
import { DocModel } from 'src/app/model/docModel';
import { SenderModel } from 'src/app/model/senderModel';
import { UserModel } from 'src/app/model/userModel';
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

  assinaturaImg$ = this.dadosService.imageDataURL$;


  isSigned: boolean = true;


  constructor(private dadosService: DadosService) {}

  ngOnInit(): void {

    console.log(this.dadosService.getAssinaturaTxt())
    
    this.dadosService.getData().subscribe((dados) => {

      this.user = this.dadosService.mapToUser(dados);
      this.sender = this.dadosService.mapToSender(dados);
      this.docModel = this.dadosService.mapToDoc(dados);


    });
  }


}
