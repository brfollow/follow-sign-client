import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DadosService } from './dadosService.service';

@Injectable({
  providedIn: 'root',
})
export class PdfStorageService {
  constructor(
    private http: HttpClient,
    private dadoService: DadosService,
  ) {}

  private apiUrl: string = 'https://app-follow-assinatura.onrender.com/api/';

  private followApiUrl = 'https://appfollow.com.br/api/';

  private mergedPdfBytes!: ArrayBuffer;
  private PdfBytesAssinatura!: ArrayBuffer;
  private contratoPdfMerged!: ArrayBuffer;

  setMergedPdf(bytes: ArrayBuffer): void {
    this.mergedPdfBytes = bytes;
  }

  getMergedPdf(): ArrayBuffer {
    return this.mergedPdfBytes;
  }

  setPdfBytesAssinatura(bytes: ArrayBuffer): void {
    this.PdfBytesAssinatura = bytes;
  }

  getPdfBytesAssinatura(): ArrayBuffer {
    return this.PdfBytesAssinatura;
  }

  enviarPDFsParaAPI(userId: string | undefined): Observable<any> {
    const formData = new FormData();
    formData.append(
      'pdfFile1',
      new Blob([this.mergedPdfBytes], { type: 'application/pdf' }),
      'arquivo1.pdf',
    );
    formData.append(
      'pdfFile2',
      new Blob([this.PdfBytesAssinatura], { type: 'application/pdf' }),
      'arquivo2.pdf',
    );

    return this.http.post(`${this.apiUrl}upload-pdfs/${userId}`, formData);
  }

  enviarPdfAssinatura(userId: string | undefined): Observable<any> {
    const formData = new FormData();
    formData.append(
      'pdfFile1',
      new Blob([this.PdfBytesAssinatura], { type: 'application/pdf' }),
      'arquivo1.pdf',
    );

    return this.http.post(
      `${this.apiUrl}upload-assinatura/${userId}`,
      formData,
    );
  }

  enviarPdfContratos(
    userId: string | undefined,
    entidade: any,
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}upload-pdfs/${userId}`, entidade);
  }

  enviarLinksPDF(pdfLinks: string[]): Observable<ArrayBuffer> {
    return this.http.post(
      `${this.apiUrl}mesclar-pdfs`,
      { pdfLinks },
      { responseType: 'arraybuffer' },
    );
  }

  // generatePdfLink(arrayBuffer: ArrayBuffer, fileName: string): string {
  //   const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
  //   const url = URL.createObjectURL(blob);
  //   return url;
  // }

  // revokePdfLink(url: string): void {
  //   URL.revokeObjectURL(url);
  // }

  setContratoPdfMerged(bytes: ArrayBuffer): void {
    this.contratoPdfMerged = bytes;
  }

  getContratoPdfMerged(): ArrayBuffer {
    return this.contratoPdfMerged;
  }

  enviarContratoParaFollow(formData: FormData): Observable<any> {
    const hash = this.dadoService.getHashUsuario();

    const endpoint = `${this.followApiUrl}sign/contract/${hash}`;

    return this.http.post(endpoint, formData);
  }

  async downloadZip(links: string[]): Promise<Observable<Blob>> {
    const body = { urls: links };
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'blob' as 'json', // Define o tipo de resposta como Blob
    };
    return this.http.post<Blob>(`${this.apiUrl}zip-files`, body, httpOptions);
  }
}
