import { Component, ElementRef, ViewChild } from '@angular/core';
import { DocModel } from 'src/app/model/docModel';
import { SenderModel } from 'src/app/model/senderModel';
import { UserModel } from 'src/app/model/userModel';
import { LogModel } from 'src/app/model/LogModel';

import { AssinaturaService } from 'src/app/service/assinatura.service';
import { DadosService } from 'src/app/service/dadosService.service';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import { PDFDocument, rgb } from 'pdf-lib';
import { PdfStorageService } from 'src/app/service/pdf.service';
import { EmailService } from 'src/app/service/email.service';

@Component({
  selector: 'app-tela-doc',
  templateUrl: './tela-doc.component.html',
  styleUrls: [
    './tela-doc.component.css',
    './tela-doc.responsive.component.css',
    './tela-doc-sender.component.css',
  ],
})
export class TelaDocComponent {
  @ViewChild('paragrafo') paragrafo!: ElementRef;
  @ViewChild('conteudoParaPDF') conteudoParaPDF!: ElementRef;

  user!: UserModel | undefined;
  sender: SenderModel | undefined;
  docModel: DocModel[] = [];
  loading: boolean = false;
  log: LogModel | undefined;
  signedPDF!: string;

  urls: string[] = [];

  isSigned: boolean = false;

  botaoDownload: boolean = false;

  assinaturaConcluida: boolean = false;

  urlDawnloadDoc: string = '';

  assinaturaImg: string = this.assinaturaService.getImageDataURL();
  assinaturaTxt: string = '';

  urlDocAssinado: string = '';
  contratos: DocModel[] = [];

  urlContratosAssinados: DocModel[] = [];

  pdfBytes!: ArrayBuffer;

  constructor(
    private dadosService: DadosService,
    private assinaturaService: AssinaturaService,
    private pdfStorageService: PdfStorageService,
    private emailService: EmailService,
  ) {}

  async ngOnInit(): Promise<void> {
    //metodo que junta os pdfs que foram recebido pela api follow

    (await this.dadosService.getData()).subscribe(async (dados) => {
      this.dadosService.isValidStatus(dados.status);

      this.user = this.dadosService.mapToUser(dados);
      this.sender = this.dadosService.mapToSender(dados);
      this.docModel = await this.dadosService.mapToDoc(dados);

      //pega os links de contratos do json
      for (let i = 0; i < this.docModel.length; i++) {
        this.urls.push(this.docModel[i].pdf_url);
        this.contratos.push(this.docModel[i]);
      }

      this.enviarLinks();
    });

    // this.mergePDFs(this.urls)
    this.pdfBytes = this.pdfStorageService.getMergedPdf();
    this.assinaturaTxt = this.assinaturaService.getAssinaturaTxt();

    this.verificarAssinatura();
  }

  async verificarAssinatura() {
    if (this.assinaturaImg) {
      this.isSigned = true;
      this.assinaturaTxt = '';
    } else if (this.assinaturaTxt) {
      this.isSigned = true;
      this.assinaturaImg = '';

      // Adiciona um atraso de  0,1 segundos antes de chamar a função gerarImagemTxt
      await this.delay(100);

      this.gerarImagemTxt();
    }
  }

  // Função para criar um atraso/ OBS: atraso necessario para criar a img de assinatura Txt
  delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  limparAssinatura() {
    this.assinaturaService.setImageDataURL('');
    this.assinaturaService.setAssinaturaTxt('');
  }

  showDawnload() {
    this.botaoDownload = true;
  }

  imagemGerada: string = '';

  //gerar uma imagem da assinatura que foi feita em txt
  gerarImagemTxt() {
    html2canvas(this.paragrafo.nativeElement).then((canvas) => {
      this.imagemGerada = canvas.toDataURL('image/jpeg', 1.0);
    });
  }

  concluirAssinatura() {
    this.loading = true;

    this.generatePDF();
  }

  generatePDF() {
    let pdf = new jsPDF('p', 'pt', [700, 845], true);

    pdf.html(this.conteudoParaPDF.nativeElement, {
      callback: async (pdf) => {
        const blob = await pdf.output('blob');
        const arrayBuffer = await new Response(blob).arrayBuffer();
        const formData = new FormData();

        formData.append(
          'file',
          new Blob([arrayBuffer], { type: 'application/pdf' }),
          'doc_assinatura.pdf',
        );

        this.pdfStorageService
          .enviarContratoParaFollow(formData)
          .subscribe(
            (response) => {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Documento Assinado com sucesso',
                showConfirmButton: false,
                timer: 3000,
              });

              this.loading = false;

              const signedPDF = response.data.url;
              this.signedPDF = signedPDF;

              this.showDawnload();
              this.assinaturaConcluida = true;
            },
            (error) => {
              Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Erro ao processar assinatura do documento. Tente novamente.',
                showConfirmButton: false,
                timer: 3000,
              });
            },
          );
      },
    });
  }

  //Metodo responsavel por enviar o email

  // TODO: revisar envio de email pós assinatura de documento.
  enviarEmail(urlsDocAssinados: any) {
    ///apagar esse metodo de pegar url pelo id

    const dados: any = {
      patient_email: this.user?.emailUser,

      user_name: this.user?.nameUser,
      // Adicione outros campos conforme necessário
    };

    // Verifica e adiciona os URLs ao objeto dados
    if (
      typeof urlsDocAssinados[0]?.url === 'string' &&
      urlsDocAssinados[0].url.trim() !== ''
    ) {
      dados.docUrl = urlsDocAssinados[0].url;
      dados.title = `${urlsDocAssinados[0].title} assinado`;
    }
    if (
      typeof urlsDocAssinados[1]?.url === 'string' &&
      urlsDocAssinados[1].url.trim() !== ''
    ) {
      dados.docUrl2 = urlsDocAssinados[1].url;
      dados.title2 = `${urlsDocAssinados[1].title} assinado`;
    }
    if (
      typeof urlsDocAssinados[2]?.url === 'string' &&
      urlsDocAssinados[2].url.trim() !== ''
    ) {
      dados.docUrl3 = urlsDocAssinados[2].url;
      dados.title3 = `${urlsDocAssinados[2].title} assinado`;
    }
    if (
      typeof urlsDocAssinados[3]?.url === 'string' &&
      urlsDocAssinados[3].url.trim() !== ''
    ) {
      dados.docUrl4 = urlsDocAssinados[3].url;
      dados.title4 = `${urlsDocAssinados[3].title} assinado`;
    }
    if (
      typeof urlsDocAssinados[4]?.url === 'string' &&
      urlsDocAssinados[4].url.trim() !== ''
    ) {
      dados.docUrl5 = urlsDocAssinados[4].url;
      dados.title5 = `${urlsDocAssinados[4].title} assinado`;
    }
    if (
      typeof urlsDocAssinados[5]?.url === 'string' &&
      urlsDocAssinados[5].url.trim() !== ''
    ) {
      dados.docUrl6 = urlsDocAssinados[5].url;
      dados.title6 = `${urlsDocAssinados[5].title} assinado`;
    }
    if (
      typeof urlsDocAssinados[6]?.url === 'string' &&
      urlsDocAssinados[6].url.trim() !== ''
    ) {
      dados.docUrl7 = urlsDocAssinados[6].url;
      dados.title7 = `${urlsDocAssinados[6].title} assinado`;
    }
    if (
      typeof urlsDocAssinados[7]?.url === 'string' &&
      urlsDocAssinados[7].url.trim() !== ''
    ) {
      dados.docUrl8 = urlsDocAssinados[7].url;
      dados.title8 = `${urlsDocAssinados[7].title} assinado`;
    }
    if (
      typeof urlsDocAssinados[8]?.url === 'string' &&
      urlsDocAssinados[8].url.trim() !== ''
    ) {
      dados.docUrl9 = urlsDocAssinados[8].url;
      dados.title9 = `${urlsDocAssinados[8].title} assinado`;
    }
    if (
      typeof urlsDocAssinados[9]?.url === 'string' &&
      urlsDocAssinados[9].url.trim() !== ''
    ) {
      dados.docUrl10 = urlsDocAssinados[9].url;
      dados.title10 = `${urlsDocAssinados[9].title} assinado`;
    }

    this.emailService.sendEmail(dados);
  }

  pdfSubscription: any;
  pdfLink: any;

  enviarLinks(): void {
    //no primeiro acesso e salvo o "PDF" arraybuffer no setContratoPdfMerged

    // TODO: substituir o uso desses PDFs pelo RESPONSE que é retornado pelo get-sign-contract-by-hash que já retorna o PDF base assinado pelo S3;
    if (this.pdfStorageService.getContratoPdfMerged()) {
      this.pdfLink = this.pdfStorageService.getMergedPdf();
    } else {
      this.loading = true;
      this.pdfSubscription = this.pdfStorageService
        .enviarLinksPDF(this.urls)
        .subscribe(
          (generatedPdfLink) => {
            this.pdfLink = generatedPdfLink;
            this.pdfStorageService.setContratoPdfMerged(this.pdfLink);
            this.pdfStorageService.setMergedPdf(this.pdfLink);
            this.loading = false;
          },
          (error) => {
            console.error('Erro ao mesclar PDFs:', error);
          },
        );
    }
  }

  async downloadPDFsAsZip() {
    const urls: string[] = [];

    for (let i = 0; i < this.urlContratosAssinados.length; i++) {
      urls.push(this.urlContratosAssinados[i].url);
    }

    (await this.pdfStorageService.downloadZip(urls)).subscribe(
      (response: Blob) => {
        // Cria um link temporário para baixar o arquivo zip
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.href = url;
        a.download = 'arquivo.zip';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Erro ao gerar arquivo zip', error);
        // Manipular erros, se necessário
      },
    );
  }
}
