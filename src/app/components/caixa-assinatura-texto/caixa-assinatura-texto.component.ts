import { Component } from '@angular/core';
import { DocModel } from 'src/app/model/docModel';
import { UserModel } from 'src/app/model/userModel';
import { AssinaturaService } from 'src/app/service/assinatura.service';
import { DadosService } from 'src/app/service/dadosService.service';

@Component({
  selector: 'app-caixa-assinatura-texto',
  templateUrl: './caixa-assinatura-texto.component.html',
  styleUrls: [
    './caixa-assinatura-texto.component.css',
    './caixa-assinatura-texto.responsive.component.css',
  ],
})
export class CaixaAssinaturaTextoComponent {
  user!: UserModel;
  docModel!: DocModel;

  statusAssinatura: boolean = false;

  constructor(
    private dadosService: DadosService,
    private assinaturaService: AssinaturaService,
  ) {}

  assinaturaSalva: string = '';

  limparInput() {
    this.assinaturaSalva = '';
  }

  async ngOnInit(): Promise<void> {
    (await this.dadosService.getData()).subscribe((dados) => {
      this.user = this.dadosService.mapToUser(dados);
      this.assinaturaSalva = this.user?.signature?.name;
    });

    this.estadoAssinatura();
  }

  enviandoAssinaturaTxt() {
    this.assinaturaService.setAssinaturaTxt(this.assinaturaSalva);
  }

  estadoAssinatura() {
    if (this.assinaturaSalva == '') {
      this.statusAssinatura = false;
    } else {
      this.statusAssinatura = true;
    }
  }
}
