import { Injectable } from '@angular/core';
import { SenderModel } from '../model/senderModel';
import { UserModel } from '../model/userModel';
import { DocModel } from '../model/docModel';
import { LogModel } from '../model/LogModel';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { dados } from '../dataFake/dadosUser';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DadosService {
  data: any;
  private apiUrl = 'https://appfollow.com.br/api/sign/contract/';
  private hashUsuario: string | null = null;

  dataAtual: string = '';
  hora: string = '';

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

  logs: LogModel[] = [];

  getHashUsuario(): string | null {
    if (!this.hashUsuario) {
      this.hashUsuario = localStorage.getItem('hashUsuario');
    }
    return this.hashUsuario;
  }

  setHashUsuario(hashUsuario: string) {
    this.hashUsuario = hashUsuario;
    localStorage.setItem('hashUsuario', hashUsuario);
  }

  getData(): Observable<any> {
    const hashAtual = this.getHashUsuario();
    this.data = this.http.get<any>(`${this.apiUrl}${hashAtual}`);

    return this.data;
  }

  getDataLogs(idUser: string | undefined) {
    return this.http.get<any>(`${this.apiUrl}/logs/${idUser}`);
  }

  postDataLog(): Observable<any> {
    console.log('salvando log');

    const logData = {
      dados_id: this.data.id,
      data: this.dataAtual,
      hours: this.hora,
      nameUserLog: ` ${this.data.nameUser} assinou o documento`,
      email: this.data.emailUser,
      cpf: this.data.cpfUser,
    };

    return this.http.post<any>(`${this.apiUrl}/logs`, logData);
  }

  // Método para converter dados brutos em instância de User
  mapToUser(user: any): UserModel {
    return {
      id: user.id,
      nameUser: user.data.patient_name,
      cpfUser: user.data.patient_cpf,
      idUser: user.data.patient_id,
      emailUser: user,
    };
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
    return document.data.contracts;

    //const doc = new DocModel();

    // doc.descricao = document.data.contracts.title;

    // try {
    //   // Chama o método getDataLogs para obter os logs do endpoint
    //   const logsData = await this.getDataLogs(data.id).toPromise();
    //   doc.logs = logsData.map((logEntry: any) => this.mapToLogEntry(logEntry));
    //   console.log(doc.logs);

    //   return doc;
    // } catch (error) {
    //   // Lida com erros aqui, se necessário
    //   console.error('Erro ao obter logs:', error);
    //   throw error;
    // }
  }

  // Método para converter dados brutos em instância de LogEntry
  private mapToLogEntry(data: any): LogModel {
    return {
      data: data.data,
      hours: data.hours,
      nameUserLog: data.nameUserLog,
      email: data.email,
      cpf: data.cpf,
      dados_id: data.dados_id,
    };
  }

  private formatarNumero(numero: number): string {
    // Adiciona um zero à esquerda se o número for menor que 10
    return numero < 10 ? `0${numero}` : `${numero}`;
  }
}
