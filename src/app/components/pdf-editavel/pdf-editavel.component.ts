import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { jsPDF } from 'jspdf';
import { LogModel } from 'src/app/model/LogModel';
import { DocModel } from 'src/app/model/docModel';
import { SenderModel } from 'src/app/model/senderModel';
import { UserModel } from 'src/app/model/userModel';
import { AssinaturaService } from 'src/app/service/assinatura.service';
import { DadosService } from 'src/app/service/dadosService.service';
import { format } from 'date-fns';
import { Data } from '@angular/router';

@Component({
  selector: 'app-pdf-editavel',
  templateUrl: './pdf-editavel.component.html',
  styleUrls: ['./pdf-editavel.component.css'],
})
export class PdfEditavelComponent implements OnInit {
  dataAtual: string = '';
  horaAtual: string = '';
  userIP: string = '';
  hora: string = '';

  user: UserModel | undefined;
  sender: SenderModel | undefined;
  docModel: DocModel[] = [];
  logs: LogModel[] = [];

  @Input()
  assinaturaTxt: string = '';
  @Input()
  assinaturaImg: string = '';

  constructor(private dadosService: DadosService) {
    const hoje = new Date();

    // Obtém o dia, mês e ano
    const dia = hoje.getDate();
    const mes = hoje.getMonth() + 1; // Mês começa do zero, então adicionamos 1
    const ano = hoje.getFullYear();
    const horas = hoje.getHours();
    const minutos = hoje.getMinutes();

    // Formata a data no formato desejado (dd/mm/yyyy)
    this.dataAtual = `${this.formatarNumero(dia)}/${this.formatarNumero(mes)}/${ano}`;
    this.horaAtual = `${this.obterHoraFormatada(hoje.toString())}`
    this.hora = `${this.formatTime(hoje)}`;
  }

  private formatarNumero(numero: number): string {
    // Adiciona um zero à esquerda se o número for menor que 10
    return numero < 10 ? `0${numero}` : `${numero}`;
  }

  async ngOnInit(): Promise<void> {

    this.getUserIp();

    (await this.dadosService.getData()).subscribe(async (dados) => {
      try {
        this.user = this.dadosService.mapToUser(dados);
        this.sender = this.dadosService.mapToSender(dados);
        this.docModel = await this.dadosService.mapToDoc(dados);
        this.logs = this.dadosService.mapToLogEntry(dados);
      } catch (error) {
        console.error('Erro ao carregar dados no componente:', error);
      }
    });
  }

  obterDataFormatada(data: string) {
    return format(new Date(data), 'dd/MM/yy');
  }

  obterHoraFormatada(data: string) {
    return format(new Date(data), 'HH:mm');
  }

  formatTime(date: Date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  async getUserIp() {
    this.dadosService.getUserIp().subscribe(
      (success) => {
        this.userIP = success.ip;
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
