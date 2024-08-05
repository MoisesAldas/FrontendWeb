import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';

import { RegistroService } from '../services/registro.service';
import { CargaritemsService } from '../services/cargaritems.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    NavbarComponent,
    HttpClientModule,
  ],
  providers: [
    FormBuilder,
    NavbarComponent,
    RegistroService,
    CargaritemsService,
  ],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css'],
})
export class CatalogoComponent {
  videojuegos: any[] = [];

  constructor(
    private cargaritemsService: CargaritemsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener videojuegos desde el servicio
    this.cargaritemsService.getAllVideojuegos().subscribe(data => {
      this.videojuegos = data;
    });
  }

  comprarVideojuego(videojuego: any) {
    // Redirigir a otra página con el nombre del videojuego en la URL
    this.router.navigate(['/videojuego-form', videojuego.nombre]);
  }
}
