import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as emailjs from 'emailjs-com';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  apiUrl:string = "http://localhost:3000/api"

  urlDawnload:any

 constructor(private http: HttpClient) {}

  getUrlPdfAssinatura(idUser:string | undefined): Observable<any> {
   
    
    this.urlDawnload = this.http.get<any>(`${this.apiUrl}/download-pdf/${idUser}`);
   
      console.log(this.urlDawnload )
    return this.urlDawnload
    
  }
 

  sendEmail(data: any) {
    
    
    emailjs.init('mr07jmLF5hmIJV5WW');
    
    const templateParams = {
      subject: "teste",
      from_name: "teste",
      link: data.url_doc,
      to_email: data.toEmail,
     
      // ... adicione outros parâmetros conforme necessário
    };
    
    return emailjs.send(
        "service_v2jhshq",
        "template_vxkokog", // Substitua pelo ID do seu modelo de e-mail no emailjs
      templateParams,
    );

     
  }
}
