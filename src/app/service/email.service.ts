import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as emailjs from 'emailjs-com';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private apiUrl:string = "https://app-follow-assinatura.onrender.com/api/"

  urlDawnload:any

 constructor(private http: HttpClient) {}

  getUrlPdfAssinatura(idUser:string | undefined): Observable<any> {


    this.urlDawnload = this.http.get<any>(`${this.apiUrl}download-pdf/${idUser}`);


    return this.urlDawnload

  }


  sendEmail(data: any) {


    emailjs.init('RpEMKtfPvK9wF2VeU');



  //   const templateParams: any = {


  //     patient_email: data.toEmail,
  //     user_name:data.user_name

  //   };

  // if (typeof data.url_doc === 'string' && data.url_doc.trim() !== '') {
  //     templateParams.docUrl = data.url_doc;
  // }
  // if (typeof data.url_doc2 === 'string' && data.url_doc2.trim() !== '') {
  //     templateParams.docUrl2 = data.url_doc2;
  // }
  // if (typeof data.url_doc3 === 'string' && data.url_doc3.trim() !== '') {
  //     templateParams.docUrl3 = data.url_doc3;
  // }



    return emailjs.send(
        "service_a786e5n",
        "template_od7x26j",
        data,
    )
    ;


  }
}
