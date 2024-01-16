import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import html2canvas from 'html2canvas';
import { UserModel } from 'src/app/model/userModel';
import { DadosService } from 'src/app/service/dadosService.service';

@Component({
  selector: 'app-caixa-assinatura-texto',
  templateUrl: './caixa-assinatura-texto.component.html',
  styleUrls: ['./caixa-assinatura-texto.component.css']
})
export class CaixaAssinaturaTextoComponent {


  user!: UserModel;

  constructor(private dadosService: DadosService) {}



  assinaturaSalva: string = ''
  



  limparInput(){
    this.assinaturaSalva = ''
  }

  ngOnInit(): void {

    this.dadosService.getData().subscribe((dados) => {

      this.user = this.dadosService.mapToUser(dados);
      this.assinaturaSalva = this.user.nameUser
    });
  }
  

}
