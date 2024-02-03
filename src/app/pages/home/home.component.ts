import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserModel } from 'src/app/model/userModel';
import { DadosService } from 'src/app/service/dadosService.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  userModel: UserModel | undefined ;
  hashUser: string =''


  constructor(private route: ActivatedRoute,private dadosService: DadosService,  private router: Router) { 

  }

  async ngOnInit(): Promise<void> {
    this.hashUser = this.route.snapshot.params['user'];
    
    
    if(this.hashUser ==""){  
      this.router.navigate(['/error']);
  
    }else{
      
    this.dadosService.setHashUsuario(this.hashUser)
    }

    
    
  //   ;(await this.dadosService.getData()).subscribe(async (dados) => {
 
  //   this.dadosService.isValidStatus(dados.status)

      
      
      
       
  
  // });


    
    
  }


  

}
