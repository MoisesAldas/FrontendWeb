import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class VoucherService {
  private apiUrl = 'http://localhost:3001/api'; // Asegúrate de que esta URL sea correcta

  constructor(private http: HttpClient) {}

  uploadVoucher(cedula: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post(`${this.apiUrl}/voucher/uploadVoucher/${cedula}`, formData)
      .pipe(
        catchError(this.handleError),
        // Añade esto para simular una respuesta exitosa
        map(() => ({ success: true, message: 'Comprobante subido con éxito' }))
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
