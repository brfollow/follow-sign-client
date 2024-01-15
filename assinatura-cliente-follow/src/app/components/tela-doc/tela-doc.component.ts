import { Component } from '@angular/core';
import { DocModel } from 'src/app/model/docModel';
import { SenderModel } from 'src/app/model/senderModel';
import { UserModel } from 'src/app/model/userModel';
import { DadosService } from 'src/app/service/dadosService.service';

@Component({
  selector: 'app-tela-doc',
  templateUrl: './tela-doc.component.html',
  styleUrls: ['./tela-doc.component.css']
})
export class TelaDocComponent {

  titleDoc:string ='teste geral';
  descriptionDoc: string ='teste descrição';

  idUser:string ='1234';
  userName: string = 'Leonardo Silva';
  userCpf:string = '123.456.789-12';

  senderName:string ='ITS TREINAMENTOS E CONSULTORIA LTDA'


  user!: UserModel ;
  sender!: SenderModel;
  docModel!:DocModel;



  isSigned: boolean = false;




  constructor(private dadosService: DadosService) {}



  ngOnInit(): void {

    this.dadosService.getData().subscribe((dados) => {

      this.user = this.dadosService.mapToUser(dados);
      this.sender = this.dadosService.mapToSender(dados);
      this.docModel = this.dadosService.mapToDoc(dados);


    });
  }


}
