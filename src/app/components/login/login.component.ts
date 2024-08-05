import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginFailed: boolean = false;

  users = [
    { username: 'usuario1', password: 'contraseña1' },
    { username: 'usuario2', password: 'contraseña2' },
    { username: 'usuario3', password: 'contraseña3' },
  ];

  constructor(private router: Router) {}

  onSubmit(): void {
    if (this.username && this.password) {
      const user = this.users.find(
        (u) => u.username === this.username && u.password === this.password
      );
      if (user) {
        console.log(`Usuario: ${this.username}, Contraseña: ${this.password}`);
        this.router.navigate(['/', 'ListarClientes']);
      } else {
        this.loginFailed = true;
        console.error('Usuario o contraseña incorrectos');
      }
    } else {
      console.error('Formulario no válido');
    }
  }

  loginAsClient(): void {
    this.router.navigate(['/', 'index']);
  }
}
