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
    
    const templateParams = {
      
      docUrl: data.url_doc,
      patient_email: data.toEmail,
      user_name:data.user_name
      // ... adicione outros parâmetros conforme necessário
    };
    
    return emailjs.send(
        "service_fispjni",
        "template_od7x26j",
      templateParams,
    )
    ;

     
  }
}
