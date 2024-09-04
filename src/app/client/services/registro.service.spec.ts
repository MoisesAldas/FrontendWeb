import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RegistroService } from './registro.service';

describe('RegistroService', () => {
  let service: RegistroService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RegistroService],
    });

    service = TestBed.inject(RegistroService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes pendientes
  });

  it('debería recuperar todos los formularios', () => {
    const dummyFormularios = [
      { id: 1, nombre: 'Formulario 1' },
      { id: 2, nombre: 'Formulario 2' },
    ];

    service.getAllFormularios().subscribe((formularios) => {
      expect(formularios.length).toBe(2);
      expect(formularios).toEqual(dummyFormularios);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyFormularios);
  });

  it('debería recuperar un formulario por ID', () => {
    const dummyFormulario = { id: 1, nombre: 'Formulario 1' };

    service.getFormularioById('1').subscribe((formulario) => {
      expect(formulario).toEqual(dummyFormulario);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyFormulario);
  });

  it('debería crear un nuevo formulario', () => {
    const dummyFormulario = { nombre: 'Nuevo Formulario' };

    service.createFormulario(dummyFormulario).subscribe((response) => {
      expect(response).toEqual(dummyFormulario);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dummyFormulario);
    req.flush(dummyFormulario);
  });

  it('debería actualizar un formulario existente', () => {
    const dummyFormulario = { nombre: 'Formulario Actualizado' };

    service.updateFormulario('1', dummyFormulario).subscribe((response) => {
      expect(response).toEqual(dummyFormulario);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(dummyFormulario);
    req.flush(dummyFormulario);
  });

  it('debería eliminar un formulario', () => {
    service.deleteFormulario('1').subscribe((response) => {
      expect(response).toBe(null);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('debería enviar un correo de prueba denegado', () => {
    const dummyData = { cedula: '1234567890', email: 'test@example.com', formulario: {} };

    service.enviarCorreoDePruebaDenegado(dummyData.cedula, dummyData.email, dummyData.formulario).subscribe((response) => {
      expect(response).toEqual(dummyData);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/enviarCorreoDePruebaDenegado`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dummyData);
    req.flush(dummyData);
  });

  it('debería enviar un correo aceptado', () => {
    const dummyData = { cedula: '1234567890', email: 'test@example.com', formulario: {} };

    service.enviarCorreoAceptado(dummyData.cedula, dummyData.email, dummyData.formulario).subscribe((response) => {
      expect(response).toEqual(dummyData);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/enviarCorreoAceptado`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dummyData);
    req.flush(dummyData);
  });

  it('debería enviar un correo de juego', () => {
    const dummyData = { cedula: '1234567890', email: 'test@example.com', formulario: {} };

    service.enviarCorreoJuego(dummyData.cedula, dummyData.email, dummyData.formulario).subscribe((response) => {
      expect(response).toEqual(dummyData);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/enviarCorreoJuego`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dummyData);
    req.flush(dummyData);
  });

  it('debería enviar un correo de juego denegado', () => {
    const dummyData = { cedula: '1234567890', email: 'test@example.com', formulario: {} };

    service.enviarCorreoJuegoDenegado(dummyData.cedula, dummyData.email, dummyData.formulario).subscribe((response) => {
      expect(response).toEqual(dummyData);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/enviarCorreoJuegoDenegado`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(dummyData);
    req.flush(dummyData);
  });
});
