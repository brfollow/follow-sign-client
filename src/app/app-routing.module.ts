import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TelaDocComponent } from './components/tela-doc/tela-doc.component';
import { TelaAssinaturaComponent } from './pages/tela-assinatura/tela-assinatura.component';
import { PdfEditavelComponent } from './components/pdf-editavel/pdf-editavel.component';
import { AlertPageComponent } from './components/alert-page/alert-page.component';

const routes: Routes = [


{
  path:'user/:user',component:HomeComponent, title:'assinatura'
},
{
  path:'doc',component:TelaDocComponent
},
{
  path:'assinatura',component:TelaAssinaturaComponent
},
{
  path:'error',component:AlertPageComponent
}





];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
