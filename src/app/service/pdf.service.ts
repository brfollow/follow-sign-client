import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PdfStorageService {

  constructor(private http: HttpClient) {}

  apiUrl: string = 'http://localhost:3000/api/';

  private mergedPdfBytes!: Uint8Array ;
  private PdfBytesAssinatura!: ArrayBuffer ;

  setMergedPdf(bytes: Uint8Array): void {
    this.mergedPdfBytes = bytes;
  }

  getMergedPdf(): Uint8Array  {
    return this.mergedPdfBytes;
  }

  setPdfBytesAssinatura(bytes: ArrayBuffer): void {
    this.PdfBytesAssinatura = bytes;
  }

  getPdfBytesAssinatura(): ArrayBuffer{
    return this.PdfBytesAssinatura;
  }

  enviarPDFsParaAPI(userId: string | undefined): Observable<any> {
    const apiUrl = 'http://localhost:3000/api/upload-pdfs/';
    console.log("aqui")
   

    const formData = new FormData();
    formData.append('pdfFile1', new Blob([this.mergedPdfBytes], { type: 'application/pdf' }), 'arquivo1.pdf');
    formData.append('pdfFile2', new Blob([this.PdfBytesAssinatura], { type: 'application/pdf' }), 'arquivo2.pdf');

    return this.http.post(`${this.apiUrl}/upload-pdfs/${userId}`, formData);
  }

}

