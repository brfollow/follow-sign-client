import { Component, ElementRef, ViewChild } from '@angular/core';
import { DocModel } from 'src/app/model/docModel';
import { SenderModel } from 'src/app/model/senderModel';
import { UserModel } from 'src/app/model/userModel';
import { LogModel } from 'src/app/model/LogModel';

import { AssinaturaService } from 'src/app/service/assinatura.service';
import { DadosService } from 'src/app/service/dadosService.service';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2'
import jsPDF from 'jspdf';
import { PDFDocument, rgb } from 'pdf-lib';
import { PdfStorageService } from 'src/app/service/pdf.service';
import { EmailService } from 'src/app/service/email.service';


@Component({
  selector: 'app-tela-doc',
  templateUrl: './tela-doc.component.html',
  styleUrls: ['./tela-doc.component.css',
            './tela-doc.responsive.component.css',
            './tela-doc-sender.component.css']
})


export class TelaDocComponent {


  @ViewChild('paragrafo') paragrafo!: ElementRef;
  @ViewChild('conteudoParaPDF') conteudoParaPDF!: ElementRef;

  user!: UserModel | undefined;;
  sender: SenderModel | undefined;
  docModel:DocModel[]=[];

  log: LogModel | undefined;

  urls = ['../../../assets/termo.pdf',

        '../../../assets/termo.pdf']

  isSigned: boolean = false;
  
  botaoDownload: boolean = false;

  assinaturaConcluida: boolean = false

  urlDawnloadDoc: string = ''

  assinaturaImg: string = this.assinaturaService.getImageDataURL()
  assinaturaTxt: string = ""

  pdfBytes!: Uint8Array ; 

  constructor(private dadosService: DadosService,
     private assinaturaService:AssinaturaService, 
     private pdfStorageService:PdfStorageService,
     private emailService:EmailService) {}

  async ngOnInit(): Promise<void> {
   
    //metodo que junta os pdfs que foram recebido pela api follow
  
    
   ;(await this.dadosService.getData()).subscribe(async (dados) => {
 
    this.dadosService.isValidHash(dados.status)

    this.user = this.dadosService.mapToUser(dados);
    
    this.sender = this.dadosService.mapToSender(dados);
    this.docModel = await this.dadosService.mapToDoc(dados);
     

});
  this.mergePDFs(this.urls)
  this.pdfBytes = this.pdfStorageService.getMergedPdf()
  this.assinaturaTxt = this.assinaturaService.getAssinaturaTxt()

 this.verificarAssinatura()

    
}




  async verificarAssinatura(){

    if (this.assinaturaImg) {
      this.isSigned = true;
      this.assinaturaTxt = '';
    } else if (this.assinaturaTxt) {
      this.isSigned = true;
      this.assinaturaImg = '';
  
      console.log("aqui 2");
  
      // Adiciona um atraso de  0,1 segundos antes de chamar a função gerarImagemTxt
      await this.delay(100);
  
      this.gerarImagemTxt();
    }
  }
  
  // Função para criar um atraso/ OBS: atraso necessario para criar a img de assinatura Txt
   delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
 
  limparAssinatura(){
    this.assinaturaService.setImageDataURL('')
    this.assinaturaService.setAssinaturaTxt('')
 
    
  }

  showDawnload(){
    this.botaoDownload = true
  }



  imagemGerada: string ='';


  //gerar uma imagem da assinatura que foi feita em txt
  gerarImagemTxt() {

    html2canvas(this.paragrafo.nativeElement).then((canvas) => {
      this.imagemGerada = canvas.toDataURL();
   
      
    });
  }



  concluirAssinatura(){

  
      //gera o pdf assinatura
    this.gerarPDF()

    if(this.user?.emailUser){
     
       this.enviarEmail()
    }
   

    Swal.fire({
      position: "center",
      icon: "success",
      title: "Documento Assinado",
      showConfirmButton: false,
      timer: 3000
    });


   
    this.showDawnload()
    this.assinaturaConcluida = true
  }

  //esse metodo faz o pdf da assinatura e envia os dois pdfs para a api follow assinatura
  gerarPDF() {
    

    let pdf = new jsPDF('p', 'pt', 'a4');

    pdf.html(this.conteudoParaPDF.nativeElement, {


      callback: async (pdf) => {

        const blob = await pdf.output('blob');
        const arrayBuffer = await new Response(blob).arrayBuffer();
        this.pdfStorageService.setPdfBytesAssinatura(arrayBuffer);
  
  
        this.pdfStorageService.enviarPDFsParaAPI(this.user?.idUser).subscribe(
          
          response => {
            // Lide com a resposta da API aqui
            console.log('Resposta da API:', response);
          },
          error => {
            // Lide com erros aqui
            console.error('Erro ao enviar PDFs para a API:', error);
          }
        );
      },
    });
 
  }

  async mergePDFs(pdfUrls: string[]): Promise<void> {
    const mergedPdf = await PDFDocument.create();

    for (const pdfUrl of pdfUrls) {
      const pdfBytes = await this.fetchPDF(pdfUrl);
      const pdfDoc = await PDFDocument.load(pdfBytes);

      const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    this.pdfBytes = await mergedPdf.save();
    this.pdfStorageService.setMergedPdf(this.pdfBytes);
  }

  private async fetchPDF(url: string): Promise<Uint8Array> {
    const response = await fetch(url);
    return new Uint8Array(await response.arrayBuffer());
  }

  

  

  enviarEmail() {

 this.emailService.getUrlPdfAssinatura(this.user?.idUser).subscribe(async (infoUrl) => {
  this.urlDawnloadDoc = infoUrl.url

    const dados = {
    toEmail: this.user?.emailUser,
    url_doc: infoUrl.url,
    user_name: this.user?.nameUser
    // Adicione outros campos conforme necessário
  }; 

  this.emailService.sendEmail(dados)
});
  
}




}
