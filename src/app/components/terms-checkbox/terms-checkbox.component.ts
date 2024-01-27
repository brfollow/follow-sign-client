import { Component } from '@angular/core';

import { DadosService } from 'src/app/service/dadosService.service';
import { UserModel } from 'src/app/model/userModel';
import { SenderModel } from 'src/app/model/senderModel';
import { DocModel } from 'src/app/model/docModel';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-terms-checkbox',
  templateUrl: './terms-checkbox.component.html',
  styleUrls: ['./terms-checkbox.component.css',
              './terms-checkbox.responsive.component.css']
})
export class TermsCheckboxComponent {

  user: UserModel | undefined ;
  sender: SenderModel | undefined;
  docModel: DocModel[] = []
  data:any


  terms: boolean = false


  constructor(private dadosService: DadosService, private http: HttpClient) {}

  TermoAceite(){

    this.terms = !this.terms



  }

  ngOnInit(): void {

      this.dadosService.getData().subscribe(async (dados) => {

      
        

        this.user = this.dadosService.mapToUser(dados);
       
        this.sender = this.dadosService.mapToSender(dados);
        
        this.docModel = await this.dadosService.mapToDoc(dados);
       

      },
      (error) => {
        console.error('Erro ao obter dados no componente:', error);
      }
      
      );

    
  }



}
