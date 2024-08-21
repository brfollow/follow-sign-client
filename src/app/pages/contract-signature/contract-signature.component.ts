import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { UserModel } from 'src/app/model/userModel';
import { DadosService } from 'src/app/service/dadosService.service';

@Component({
  selector: 'app-contract-signature',
  templateUrl: './contract-signature.component.html',
  styleUrls: ['./contract-signature.component.css'],
})
export class ContractSignatureComponent {
  user!: UserModel;
  hash: string = '';

  constructor(
    private route: ActivatedRoute,
    private dadosService: DadosService,
  ) {}

  ngOnInit(): void {
    this.hash = this.route.snapshot.params['hash'];
    this.dadosService.setHashUsuario(this.hash);
  }
}
