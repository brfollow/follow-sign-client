import { Component } from '@angular/core';
import {dados} from '../../dataFake/dadosUser'
import { DadosService } from 'src/app/service/dadosService.service';
import { UserModel } from 'src/app/model/userModel';
import { SenderModel } from 'src/app/model/senderModel';
import { DocModel } from 'src/app/model/docModel';

@Component({
  selector: 'app-terms-checkbox',
  templateUrl: './terms-checkbox.component.html',
  styleUrls: ['./terms-checkbox.component.css']
})
export class TermsCheckboxComponent {

  user!: UserModel;
  sender!: SenderModel;
  docModel!:DocModel


  dados = dados

  idUser: string ='123'
  nameUser: string ='Leonardo Silva"'
  docName: string ='teste.pdf'
  senderName: string='ITS TREINAMENTOS E CNSULTORIA LTDA'
  senderEmail: string='financeiro@email.com'
  senderPhone: string ='(99) 88888-8888'


  terms: boolean = false


  constructor(private dadosService: DadosService) {}

  TermoAceite(){
    
    this.terms = !this.terms  

    
   
  }

  ngOnInit(): void {
    console.log("dados")
   this.user = this.dadosService.mapToUser(this.dados)
   console.log(this.user)
   this.sender = this.dadosService.mapToSender(dados)
 // this.docModel = this.dadosService.mapToDoc(dados)
  }



}
