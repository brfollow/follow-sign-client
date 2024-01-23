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


  private idUsuario: string | null =null;

  data:any
  private apiUrl = 'http://localhost:3000/api'; 

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






 getIdUsuario(): string | null{
  if (!this.idUsuario) {
    this.idUsuario = localStorage.getItem('userId');
  }
  return this.idUsuario;
}
 


 setIdUsuario(idUsuario: string){
   this.idUsuario = idUsuario
   localStorage.setItem('userId', idUsuario);
 }




  getData(): Observable<any> {
   
    const idAtual = this.getIdUsuario()
    this.data = this.http.get<any>(`${this.apiUrl}/dados/${idAtual}`);
    console.log(this.data);
    
    return this.data
    
  }


  getDataLogs(idUser:string | undefined){

   return this.http.get<any>(`${this.apiUrl}/logs/${idUser}`);

  }


  postDataLog(): Observable<any> {
    console.log("salvando log");
    
    const logData = {
      dados_id: this.data.id,
      data: this.dataAtual,
      hours: this.hora,
      nameUserLog:` ${this.data.nameUser} assinou o documento` ,
      email: this.data.emailUser,
      cpf: this.data.cpfUser,
    }


    return this.http.post<any>(`${this.apiUrl}/logs`, logData);
  }

 


// Método para converter dados brutos em instância de User
mapToUser(data: any): UserModel {
 
  return {
    id: data.id,
    nameUser: data.nameUser,
    cpfUser: data.cpfUser,
    idUser: data.idUser,
    emailUser:data.emailUser
  }


}

// Método para converter dados brutos em instância de Sender
mapToSender(data: any): SenderModel {
  return {
    senderName: data.senderName,
    senderPhone: data.senderPhone,
    senderEmail: data.senderEmail,
  };
}

// Método para converter dados brutos em instância de Doc
async mapToDoc(data: any): Promise<DocModel> {
  const doc = new DocModel();

  doc.docName = data.docName;
  doc.title = data.title;
  doc.descricao = data.descricao;

  try {
    // Chama o método getDataLogs para obter os logs do endpoint
    const logsData = await this.getDataLogs(data.id).toPromise();
    doc.logs = logsData.map((logEntry: any) => this.mapToLogEntry(logEntry));
    console.log(doc.logs);
    
    return doc;
  } catch (error) {
    // Lida com erros aqui, se necessário
    console.error('Erro ao obter logs:', error);
    throw error;
  }
}



// Método para converter dados brutos em instância de LogEntry
private mapToLogEntry(data: any): LogModel {

 
  return {
    data: data.data,
    hours: data.hours,
    nameUserLog: data.nameUserLog,
    email: data.email,
    cpf: data.cpf,
    dados_id:data.dados_id
  };
}

private formatarNumero(numero: number): string {
  // Adiciona um zero à esquerda se o número for menor que 10
  return numero < 10 ? `0${numero}` : `${numero}`;
}

}
