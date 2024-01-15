import { Component } from '@angular/core';

@Component({
  selector: 'app-terms-checkbox',
  templateUrl: './terms-checkbox.component.html',
  styleUrls: ['./terms-checkbox.component.css']
})
export class TermsCheckboxComponent {

  idUser: string ='123'
  nameUser: string ='Leonardo Silva"'
  docName: string ='teste.pdf'
  senderName: string='ITS TREINAMENTOS E CNSULTORIA LTDA'
  senderEmail: string='financeiro@email.com'
  senderPhone: string ='(99) 88888-8888'


  terms: boolean = false


  

  TermoAceite(){
    
    this.terms = !this.terms  

    
   
  }





}
