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
  private apiUrl = 'http://localhost:3000/api'; 
 constructor(private http: HttpClient) {}


 logs: LogModel[] = []

  getData(): Observable<any> {
   
    
    this.data = this.http.get<any>(`${this.apiUrl}/dados/5678`);
 
    return this.data
    
  }


  getDataLogs(idUser:string | undefined){

   return this.http.get<any>(`${this.apiUrl}/logs/${idUser}`);

  }


  postDataLog(logData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logs`, logData);
  }

 


// Método para converter dados brutos em instância de User
mapToUser(data: any): UserModel {
 
  return {
    id: data.id,
    nameUser: data.nameUser,
    cpfUser: data.cpfUser,
    idUser: data.idUser,
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
    cpf: data.cpf
  };
}


}
