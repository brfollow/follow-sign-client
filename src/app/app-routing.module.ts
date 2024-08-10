import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { ContractSignatureComponent } from './pages/contract-signature/contract-signature.component';

import { TelaDocComponent } from './components/tela-doc/tela-doc.component';
import { TelaAssinaturaComponent } from './pages/tela-assinatura/tela-assinatura.component';
import { AlertPageComponent } from './components/alert-page/alert-page.component';

const routes: Routes = [
  {
    path: 'user/:user',
    component: HomeComponent,
    title: 'assinatura',
  },
  {
    path: 'contract-signature/:hash',
    component: ContractSignatureComponent,
    title: 'Assinatura de Contrato',
  },
  {
    path: 'doc',
    component: TelaDocComponent,
  },
  {
    path: 'assinatura',
    component: TelaAssinaturaComponent,
  },
  {
    path: 'error',
    component: AlertPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
