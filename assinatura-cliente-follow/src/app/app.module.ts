import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HomeComponent } from './pages/home/home.component';
import { TermsCheckboxComponent } from './components/terms-checkbox/terms-checkbox.component';
import { TelaDocComponent } from './components/tela-doc/tela-doc.component';
import { PdfEditavelComponent } from './components/pdf-editavel/pdf-editavel.component';
import { TelaAssinaturaComponent } from './pages/tela-assinatura/tela-assinatura.component';
import { CaixaAssinaturaComponent } from './components/caixa-assinatura/caixa-assinatura.component';
import { CaixaAssinaturaTextoComponent } from './components/caixa-assinatura-texto/caixa-assinatura-texto.component';


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    TermsCheckboxComponent,
    TelaDocComponent,
    PdfEditavelComponent,
    TelaAssinaturaComponent,
    CaixaAssinaturaComponent,
    CaixaAssinaturaTextoComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
