import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PdfStorageService {

  constructor(private http: HttpClient) {}

  apiUrl: string = 'https://followw-assinatura.onrender.com/api/';

  private mergedPdfBytes!: ArrayBuffer ;
  private PdfBytesAssinatura!: ArrayBuffer ;

  setMergedPdf(bytes: ArrayBuffer): void {
    this.mergedPdfBytes = bytes;
  }

  getMergedPdf(): ArrayBuffer  {
    return this.mergedPdfBytes;
  }

  setPdfBytesAssinatura(bytes: ArrayBuffer): void {
    this.PdfBytesAssinatura = bytes;
  }

  getPdfBytesAssinatura(): ArrayBuffer{
    return this.PdfBytesAssinatura;
  }

  enviarPDFsParaAPI(userId: string | undefined): Observable<any> {
      

    const formData = new FormData();
    formData.append('pdfFile1', new Blob([this.mergedPdfBytes], { type: 'application/pdf' }), 'arquivo1.pdf');
    formData.append('pdfFile2', new Blob([this.PdfBytesAssinatura], { type: 'application/pdf' }), 'arquivo2.pdf');

    return this.http.post(`${this.apiUrl}upload-pdfs/${userId}`, formData);
  }


  enviarLinksPDF(pdfLinks: string[]): Observable<ArrayBuffer> {
    return this.http.post(`${this.apiUrl}mesclar-pdfs`, { pdfLinks }, { responseType: 'arraybuffer' });
  }

  generatePdfLink(arrayBuffer: ArrayBuffer, fileName: string): string {
    const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    return url;
  }

  revokePdfLink(url: string): void {
    URL.revokeObjectURL(url);
  }
}

