import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegistroService {
  private apiUrl = 'http://34.105.5.0:3001/api/formulario';

  constructor(private http: HttpClient) {}

  // Obtener todos los formularios
  getAllFormularios(): Observable<any> {
    return this.http.get(`${this.apiUrl}/`);
  }

  // Obtener un formulario por ID
  getFormularioById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo formulario
  createFormulario(formulario: any): Observable<any> {
    console.log("datos que se envian al formulario desde angular: ",formulario)
    return this.http.post(`${this.apiUrl}/`, formulario);
  }

  // Actualizar un formulario existente
  updateFormulario(id: string, formulario: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formulario);
  }

  // Eliminar un formulario
  deleteFormulario(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  // Enviar correo de prueba denegado
  // Enviar correo de prueba denegado
  enviarCorreoDePruebaDenegado(
    cedula: string,
    email: string,
    formulario: any
  ): Observable<any> {
    const data = { cedula, email, formulario };
    return this.http.post(`${this.apiUrl}/enviarCorreoDePruebaDenegado`, data);
  }

  enviarCorreoAceptado(
    cedula: string,
    email: string,
    formulario: any
  ): Observable<any> {
    const data = { cedula, email, formulario };
    return this.http.post(`${this.apiUrl}/enviarCorreoAceptado`, data);
  }
  enviarCorreoJuego(
    cedula: string,
    email: string,
    formulario: any
  ): Observable<any> {
    const data = { cedula, email, formulario };
    return this.http.post(`${this.apiUrl}/enviarCorreoJuego`, data);
  }

  enviarCorreoJuegoDenegado(
    cedula: string,
    email: string,
    formulario: any
  ): Observable<any> {
    const data = { cedula, email, formulario };
    return this.http.post(`${this.apiUrl}/enviarCorreoJuegoDenegado`, data);
  }
}
