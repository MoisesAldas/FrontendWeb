import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './inner-navbar.component.html',
  styleUrl: './inner-navbar.component.css'
})
export class InnerNavbarComponent  {

  constructor(private router: Router) {
  }

  goToTabla1() {
    this.router.navigate(['/', 'tabla1']);
  }
  goToTablafinal() {
    this.router.navigate(['/', 'final-datatable']);
  }
  goToClientes() {
    this.router.navigate(['/', 'ListarClientes']);
  }
  logout(): void {
    this.router.navigate(['/login']);
  }
}
