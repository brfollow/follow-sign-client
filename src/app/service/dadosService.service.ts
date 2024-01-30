import { Injectable } from '@angular/core';
import { SenderModel } from '../model/senderModel';
import { UserModel } from '../model/userModel';
import{DocModel} from '../model/docModel'
import { LogModel } from '../model/LogModel';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {dados} from '../dataFake/dadosUser'
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class DadosService {


 

  data:any
  private apiUrl = 'https://appfollow.com.br/api/sign/contract/'; 
  private hashUsuario: string | null =null;



  dataAtual: string ='';
  hora:string =''
 

  constructor(private http: HttpClient) {


  const hoje = new Date();

  // Obtém o dia, mês e ano
  const dia = hoje.getDate();
  const mes = hoje.getMonth() + 1; // Mês começa do zero, então adicionamos 1
  const ano = hoje.getFullYear();
  const horas = hoje.getHours();
  const minutos = hoje.getMinutes();

   // Formata a data no formato desejado (dd/mm/yyyy)
   this.dataAtual = `${this.formatarNumero(dia)}/${this.formatarNumero(mes)}/${ano}`;
   this.hora = `${horas}:${minutos}`;

  }


 logs: LogModel[] = []






 getHashUsuario(): string | null{
  if (!this.hashUsuario) {
    this.hashUsuario = localStorage.getItem('hashUsuario');
  }
  return this.hashUsuario;
}
 


 setHashUsuario(hashUsuario: string){
   this.hashUsuario = hashUsuario
   localStorage.setItem('hashUsuario', hashUsuario);
 }




  async getData(): Promise<Observable<any>> {
   
    const hashAtual = this.getHashUsuario()
    this.data = this.http.get<any>(`${this.apiUrl}${hashAtual}`);
   
      
    return this.data
    
  }


  getDataLogs(idUser:string | undefined){

   return this.http.get<any>(`${this.apiUrl}/logs/${idUser}`);

  }


  // postDataLog(userModel:UserModel | any ): Observable<any> {
  //   const urlAssinaturaAPi = "http://localhost:3000/api/"
   
    
  //   const logData = {
  //     dados_id: userModel.idUser,
  //     nameUserLog:userModel.nameUser,
  //     email: "teste@gmail.com",
  //     cpf: userModel.cpfUser,
  //     status: "assinou o documento"
  //   }


  //   return this.http.post<any>(`${urlAssinaturaAPi}logs`, logData);
  // }

 


// Método para converter dados brutos em instância de User
mapToUser(user: any): UserModel {
 
  return {
    id: user.id,
    nameUser: user.data.patient_name,
    cpfUser: user.data.patient_cpf,
    idUser: user.data.patient_id,
    emailUser:user.data.patient_email

  }


}

// Método para converter dados brutos em instância de Sender
mapToSender(sender: any): SenderModel {
  return {
    senderName: sender.data.razao_social,
    senderPhone: sender.data.contact_phone,
    senderEmail: sender.data.contact_email,
  };
}

// Método para converter dados brutos em instância de Doc
 mapToDoc(document: any) {

 return document.data.contracts
  

}

// Método para converter dados brutos em instância de LogEntry
 mapToLogEntry(document: any) {

 
  return document.data.logs
}

private formatarNumero(numero: number): string {
  // Adiciona um zero à esquerda se o número for menor que 10
  return numero < 10 ? `0${numero}` : `${numero}`;
}

}
