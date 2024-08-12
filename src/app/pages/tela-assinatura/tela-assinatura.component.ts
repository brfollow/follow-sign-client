// tela-assinatura.component.ts
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-tela-assinatura',
  templateUrl: './tela-assinatura.component.html',
  styleUrls: [
    './tela-assinatura.component.css',
    './tela-assinatura.responsive.component.css',
  ],
})
export class TelaAssinaturaComponent {
  modoAssinatura: boolean = true;
  larguraDaTela: number = 0;
  alturaDaTela: number = 0;

  trocaMode(estadoAtual: boolean) {
    this.modoAssinatura = !estadoAtual;
  }

  ngOnInit() {
    // Inicializar os valores ao carregar o componente
    this.atualizarTamanhoDaTela();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    // Atualizar os valores quando a janela for redimensionada
    this.atualizarTamanhoDaTela();
  }

  private atualizarTamanhoDaTela() {
    // Obter o tamanho da tela
    this.larguraDaTela = window.innerWidth;
    if (this.larguraDaTela < 455) {
      this.larguraDaTela = window.innerWidth - 30;
    } else if (window.innerWidth >= 455 && window.innerWidth < 700) {
      this.larguraDaTela = 417.516;
    } else {
      this.larguraDaTela = 600;
    }
  }
}
