import { Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import html2canvas from 'html2canvas';
import { DocModel } from 'src/app/model/docModel';
import { UserModel } from 'src/app/model/userModel';
import { AssinaturaService } from 'src/app/service/assinatura.service';
import { DadosService } from 'src/app/service/dadosService.service';



@Component({
  selector: 'app-caixa-assinatura-texto',
  templateUrl: './caixa-assinatura-texto.component.html',
  styleUrls: ['./caixa-assinatura-texto.component.css']
})
export class CaixaAssinaturaTextoComponent {

  
  @ViewChild('assinaturaTxt', { static: true }) signatureCanvas!: ElementRef<HTMLInputElement>;

  user!: UserModel;
  docModel!: DocModel

  constructor(private dadosService: DadosService, private assinaturaService: AssinaturaService) {}



  assinaturaSalva: string = ''

  imagemGerada:string =''




  limparInput(){
    this.assinaturaSalva = ''
  }



  ngOnInit(): void {

    

    this.dadosService.getData().subscribe((dados) => {

          this.user = this.dadosService.mapToUser(dados);
        
    });


    this.assinaturaSalva = this.user.nameUser + " ( "+ this.user.idUser+ " )"
  }


  enviandoAssinaturaTxt() {
    // Lógica para obter ou definir seu texto

    // Armazene o texto no serviço
    this.assinaturaService.setAssinaturaTxt(this.imagemGerada);
  }

  gerarImagem() {
    html2canvas(this.signatureCanvas.nativeElement).then(canvas => {
      this.imagemGerada = canvas.toDataURL('image/png');
   
      this.enviandoAssinaturaTxt()
      
    });


  }
}
