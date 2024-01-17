import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import html2canvas from 'html2canvas';
import { DocModel } from 'src/app/model/docModel';
import { UserModel } from 'src/app/model/userModel';
import { DadosService } from 'src/app/service/dadosService.service';



@Component({
  selector: 'app-caixa-assinatura-texto',
  templateUrl: './caixa-assinatura-texto.component.html',
  styleUrls: ['./caixa-assinatura-texto.component.css']
})
export class CaixaAssinaturaTextoComponent {


  user!: UserModel;
  docModel!: DocModel

  constructor(private dadosService: DadosService) {}



  assinaturaSalva: string = ''




  limparInput(){
    this.assinaturaSalva = ''
  }



  ngOnInit(): void {

    console.log(this.assinaturaSalva)

 this.dadosService.getData().subscribe((dados) => {

      this.user = this.dadosService.mapToUser(dados);
    
    });
  }


  enviandoAssinaturaTxt() {
    // Lógica para obter ou definir seu texto

    // Armazene o texto no serviço
    this.dadosService.setText(this.assinaturaSalva);
  }

}
