import { Component } from '@angular/core';

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

  isSigned: boolean = false;



}
