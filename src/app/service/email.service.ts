import { Injectable } from '@angular/core';
import * as emailjs from 'emailjs-com';


@Injectable({
  providedIn: 'root'
})
export class EmailService {

   private emailjsServiceId = 'SEU_SERVICE_ID'; // Substitua pelo seu Service ID
  private emailjsUserId = 'SEU_USER_ID'; // Substitua pelo seu User ID

  constructor() {}

  sendEmail(data: any) {
    
    
    emailjs.init('mr07jmLF5hmIJV5WW');
    
    const templateParams = {
      subject: "teste",
      from_name: "teste",
      link: "www.google.com",
      to_email: data.toEmail,
      message: data.message,
      // ... adicione outros parâmetros conforme necessário
    };
    
    return emailjs.send(
        "service_v2jhshq",
        "template_vxkokog", // Substitua pelo ID do seu modelo de e-mail no emailjs
      templateParams,
    );

     
  }
}
