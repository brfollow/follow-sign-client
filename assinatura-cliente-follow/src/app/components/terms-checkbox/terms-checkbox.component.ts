import { Component } from '@angular/core';

import { DadosService } from 'src/app/service/dadosService.service';
import { UserModel } from 'src/app/model/userModel';
import { SenderModel } from 'src/app/model/senderModel';
import { DocModel } from 'src/app/model/docModel';

@Component({
  selector: 'app-terms-checkbox',
  templateUrl: './terms-checkbox.component.html',
  styleUrls: ['./terms-checkbox.component.css',
              './terms-checkbox.responsive.component.css']
})
export class TermsCheckboxComponent {

  user!: UserModel ;
  sender!: SenderModel;
  docModel!:DocModel



  terms: boolean = false


  constructor(private dadosService: DadosService) {}

  TermoAceite(){

    this.terms = !this.terms



  }

  ngOnInit(): void {

    this.dadosService.getData().subscribe((dados) => {

      this.user = this.dadosService.mapToUser(dados);
      this.sender = this.dadosService.mapToSender(dados);
      this.docModel = this.dadosService.mapToDoc(dados);


    });
  }



}
