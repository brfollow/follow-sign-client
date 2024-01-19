import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { jsPDF } from 'jspdf';
import { DocModel } from 'src/app/model/docModel';
import { SenderModel } from 'src/app/model/senderModel';
import { UserModel } from 'src/app/model/userModel';
import { AssinaturaService } from 'src/app/service/assinatura.service';
import { DadosService } from 'src/app/service/dadosService.service';




@Component({
  selector: 'app-pdf-editavel',
  templateUrl: './pdf-editavel.component.html',
  styleUrls: ['./pdf-editavel.component.css']
})
export class PdfEditavelComponent implements OnInit {


 


  user!: UserModel;
  sender!: SenderModel;
  docModel!:DocModel;

  
  // assinaturaTxt: string = this.assinaturaService.getAssinaturaTxt();
  // assinaturaImg: string= this.assinaturaService.getImageDataURL();

  @Input()
  assinaturaTxt: string = '';
  @Input()
  assinaturaImg: string= '';

  constructor(private dadosService: DadosService, private assinaturaService:AssinaturaService ) {}


  ngOnInit(): void {

    this.dadosService.getData().subscribe((dados) => {

      this.user = this.dadosService.mapToUser(dados);
      this.sender = this.dadosService.mapToSender(dados);
      this.docModel = this.dadosService.mapToDoc(dados);


    });

  }

  
 
  // ngAfterViewInit() {
  //   // Agora, é seguro acessar nativeElement
  //   const conteudo = this.conteudoParaPDF.nativeElement;
   
  // }

  
 


}
