import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DadosService } from 'src/app/service/dadosService.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  user: string =''


  constructor(private route: ActivatedRoute,private dadosService: DadosService) { 

  }

  ngOnInit(): void {
    this.user = this.route.snapshot.params['user'];
    // Agora, 'suaVariavel' contém o valor passado na rota

 
 console.log(this.user);
    this.dadosService.setIdUsuario(this.user)
   
    console.log(this.user);


    
    
  }
  

}
