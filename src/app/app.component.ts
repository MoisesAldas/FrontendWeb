import { Component } from '@angular/core';
import { LoginComponent } from './components/login/login.component';
import { Router, RouterOutlet } from '@angular/router';
import { Tabla1Component } from './views/tabla1/tabla1.component';
import { FinalDatatableComponent } from './views/final-datatable/final-datatable.component';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    LoginComponent,
    Tabla1Component,
    TableModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    FinalDatatableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ProyectoAV_VideoJuegos';
}
