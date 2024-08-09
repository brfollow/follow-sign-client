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
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { AlertPageComponent } from './components/alert-page/alert-page.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';

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
    AlertPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgxExtendedPdfViewerModule,
    PdfViewerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
