import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { SenderModel } from '../model/senderModel';
import { UserModel } from '../model/userModel';
import { LogModel } from '../model/LogModel';

@Injectable({
  providedIn: 'root',
})
export class DadosService {
  data: any;
  private apiUrl = 'https://appfollow.com.br/api/sign/contract/';

  private hashUsuario: string | null = null;

  dataAtual: string = '';
  hora: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
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

  async getData(): Promise<Observable<any>> {
    const hashAtual = this.getHashUsuario();

    this.data = this.http.get<any>(`${this.apiUrl}${hashAtual}`);

    return this.data;
  }

  getDataLogs(idUser: string | undefined) {
    return this.http.get<any>(`${this.apiUrl}/logs/${idUser}`);
  }

  getUserIp(): Observable<{ ip: string }> {
    const IPURL = 'https://api.ipify.org?format=json';

    return this.http.get<{ ip: string }>(IPURL);
  }

  // Método para converter dados brutos em instância de User
  mapToUser(user: any): UserModel {
    return {
      id: user.id,
      nameUser: user.data.patient_name,
      cpfUser: user.data.patient_cpf,
      idUser: user.data.patient_id,
      emailUser: user.data.patient_email,
      signature: {
        name: user.data.contact_name,
        email: user.data.contact_email,
        type: this.mapContactType(user.data.contact_type),
        phone: user.data.contact_phone,
      },
    };
  }

  mapContactType(type: string) {
    const options: any = {
      professional: 'Profissional',
      patient: 'Paciente',
      witness: 'Testemunha',
    };
    return options[type];
  }

  // Método para converter dados brutos em instância de Sender
  mapToSender(sender: any): SenderModel {
    return {
      senderName: sender.data.razao_social,
      senderPhone: sender.data.contact_phone,
      senderEmail: sender.data.contact_email,
      senderType: sender.data.contact_type,
    };
  }

  // Método para converter dados brutos em instância de Doc
  mapToDoc(document: any) {
    return document.data.contracts;
  }

  // Método para converter dados brutos em instância de LogEntry
  mapToLogEntry(document: any) {
    return document.data.logs;
  }

  private formatarNumero(numero: number): string {
    // Adiciona um zero à esquerda se o número for menor que 10
    return numero < 10 ? `0${numero}` : `${numero}`;
  }

  isValidStatus(status: string) {
    if (status == 'success') {
    } else {
      this.router.navigate(['/error']);
    }
  }
}
