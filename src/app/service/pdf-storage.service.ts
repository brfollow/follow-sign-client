import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PdfStorageService {

  constructor() { }

  private mergedPdfBytes!: Uint8Array ;

  setMergedPdf(bytes: Uint8Array): void {
    this.mergedPdfBytes = bytes;
  }

  getMergedPdf(): Uint8Array  {
    return this.mergedPdfBytes;
  }

}
