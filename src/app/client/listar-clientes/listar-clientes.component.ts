import { Component } from '@angular/core';
import { RegistroService } from '../services/registro.service';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { FormBuilder } from '@angular/forms';
import { CargaritemsService } from '../services/cargaritems.service';
import { InnerNavbarComponent } from '../../components/inner-navbar/inner-navbar.component';
import Swal from 'sweetalert2';

import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { response } from 'express';

@Component({
  selector: 'app-listar-clientes',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    InnerNavbarComponent,
    HttpClientModule,
    TableModule,
    InputTextModule,
    ButtonModule,
  ],
  providers: [
    FormBuilder,
    InnerNavbarComponent,
    RegistroService,
    CargaritemsService,
  ],
  templateUrl: './listar-clientes.component.html',
  styleUrl: './listar-clientes.component.css',
})
export class ListarClientesComponent {
  clientes: any[] = [];

  constructor(
    private registroService: RegistroService,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.obtenerClientes();
    this.clientes = this.clientes.map(cliente => ({
      ...cliente,
      imagenUrl: this.getImageUrl(cliente.imagenComprobante)
    }));

  }

  getImageUrl(base64String: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,' + base64String);
  }

  obtenerClientes(): void {
    this.registroService.getAllFormularios().subscribe(
      (data) => {
        // Initialize estado field to 'Pendiente'
        this.clientes = data.map((cliente: any) => ({
          ...cliente

        }));
      },
      (error) => {
        console.error('Error al obtener los clientes', error);
      }
    );
  }

  denegarCliente(cliente: any): void {
    const { cedula, email } = cliente;
  
    this.registroService
      .enviarCorreoDePruebaDenegado(cedula, email, cliente)
      .subscribe(
        (response) => {
          // Delete the form after sending the email
          this.registroService.deleteFormulario(cliente._id).subscribe(
            () => {
              Swal.fire('Cliente Notificado', 'Formulario eliminado y cliente notificado por correo.', 'success');
            },
            (error) => {
              console.error('Error al eliminar el formulario:', error);
              Swal.fire('Error', 'No se pudo eliminar el formulario', 'error');
            }
          );
        },
        (error) => {
          console.error('Error al enviar el correo:', error);
          Swal.fire('Error', 'No se pudo enviar el correo', 'error');
        }
      );
  }

  aceptarCliente(cliente: any): void {
    const { cedula, email } = cliente;
    this.registroService.enviarCorreoAceptado(cedula, email, cliente).subscribe(
      (response) => {
        this.registroService.updateFormulario(cliente._id, { estado: 'Aceptado' }).subscribe(
          (updatedCliente) => {
            cliente.estado = updatedCliente.estado; // Asegúrate de que el cliente se actualiza con la respuesta
            Swal.fire('Éxito', response.msg, 'success');
          },
          (error) => {
            console.error('Error al actualizar el formulario:', error);
            Swal.fire('Éxito', response.msg, 'success');
          }
        );
      },
      (error) => {
        console.error('Error al enviar el correo:', error);
        Swal.fire('Éxito',  'success');
      }
    );
  }
}
