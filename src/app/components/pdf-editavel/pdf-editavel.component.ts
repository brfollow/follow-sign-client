import { Component } from '@angular/core';
import { DocModel } from 'src/app/model/docModel';
import { SenderModel } from 'src/app/model/senderModel';
import { UserModel } from 'src/app/model/userModel';
import { DadosService } from 'src/app/service/dadosService.service';

@Component({
  selector: 'app-pdf-editavel',
  templateUrl: './pdf-editavel.component.html',
  styleUrls: ['./pdf-editavel.component.css']
})
export class PdfEditavelComponent {
  user!: UserModel;
  sender!: SenderModel;
  docModel!:DocModel;

  
  assinaturaTxt: string = ''

  assinaturaImg$ = this.dadosService.imageDataURL$;

  constructor(private dadosService: DadosService) {}


  ngOnInit(): void {

    this.dadosService.getData().subscribe((dados) => {

      this.user = this.dadosService.mapToUser(dados);
      this.sender = this.dadosService.mapToSender(dados);
      this.docModel = this.dadosService.mapToDoc(dados);


    });

    


  }

}
