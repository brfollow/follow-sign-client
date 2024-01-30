import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DadosService } from 'src/app/service/dadosService.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {


  constructor(private dadosService: DadosService, private router: Router) { 

  }


  async ngOnInit(): Promise<void> {
   
  
    (await this.dadosService.getData()).subscribe(async (dados) => {
 
      this.isValidHash(dados.status)
       
    });
  }

  isValidHash(status: string){
    if(status === "success"){

    }else{
      console.log(status);
      
      this.router.navigate(['/error']);
    }
  }


}