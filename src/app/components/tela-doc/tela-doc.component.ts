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



  


  assinaturaImg: string = this.assinaturaService.getImageDataURL()
  assinaturaTxt: string = this.assinaturaService.getAssinaturaTxt()

  pdfBytes!: Uint8Array ; 

  constructor(private dadosService: DadosService,
     private assinaturaService:AssinaturaService, 
     private pdfStorageService:PdfStorageService,
     private emailService:EmailService) {}

  ngOnInit(): void {

    //metodo que junta os pdfs que foram recebido pela api follow
    this.mergePDFs(this.urls)
    this.pdfBytes = this.pdfStorageService.getMergedPdf()
    
   this.dadosService.getData().subscribe(async (dados) => {
 
    

    this.user = this.dadosService.mapToUser(dados);
    this.sender = this.dadosService.mapToSender(dados);
    this.docModel = await this.dadosService.mapToDoc(dados);
    
     

});



 this.verificarAssinatura()


    
}




  verificarAssinatura(){

    if(this.assinaturaImg){
      this.isSigned = true
      this.assinaturaTxt = ''
            
    }else if(this.assinaturaTxt){
      this.isSigned = true
     
      this.assinaturaImg = ''

      
    
    }
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
    this.dadosService.postDataLog(this.user).subscribe(
      (response) => {

        //gera o pdf assinatura
        this.gerarPDF()
        
        this.enviarEmail()

        console.log('Log postado com sucesso:', response);
        // Lógica adicional, se necessário
      },
      (error) => {
        console.error('Erro ao postar o log:', error);
        // Lida com erros aqui, se necessário
      }
      );
    
   if(this.assinaturaTxt){
      this.gerarImagemTxt()
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
  
        console.log(this.user?.idUser);
  
        // Esperar até que o conteúdo do PDF seja totalmente gerado antes de chamar enviarPDFsParaAPI
        await new Promise(resolve => setTimeout(resolve, 0));
  
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

  

  dados = {
    toEmail: 'leonardosilva01107@gmail.com',
    message: 'Olá, isso é um teste!',
    // Adicione outros campos conforme necessário
  };

  enviarEmail() {
    
    this.emailService.sendEmail(this.dados)
  }


}
