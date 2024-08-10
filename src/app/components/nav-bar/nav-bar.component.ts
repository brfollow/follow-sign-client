import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DadosService } from 'src/app/service/dadosService.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent {
  constructor(
    private dadosService: DadosService,
    private router: Router,
  ) {}

  // ngOnInit(): void {
  //   this.dadosService.getData().subscribe(async (dados) => {
  //     this.isValidHash(dados.status);
  //     console.log(dados);
  //   });
  // }

  isValidHash(status: string) {
    if (status === 'success') {
    } else {
      this.router.navigate(['/error']);
    }
  }
}
