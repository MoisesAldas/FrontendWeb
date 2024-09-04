import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CargaritemsService } from './cargaritems.service';

describe('CargaritemsService', () => {
  let service: CargaritemsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CargaritemsService]
    });

    service = TestBed.inject(CargaritemsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes pendientes
  });

  it('debería recuperar todos los videojuegos', () => {
    const dummyVideojuegos = [
      { id: 1, nombre: 'Juego 1' },
      { id: 2, nombre: 'Juego 2' }
    ];

    service.getAllVideojuegos().subscribe((videojuegos) => {
      expect(videojuegos.length).toBe(2);
      expect(videojuegos).toEqual(dummyVideojuegos);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/videojuegos`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyVideojuegos);
  });

  it('debería recuperar todos los descuentos', () => {
    const dummyDescuentos = [
      { id: 1, codigo: 'DESC1', valor: 10 },
      { id: 2, codigo: 'DESC2', valor: 20 }
    ];

    service.getAllDescuentos().subscribe((descuentos) => {
      expect(descuentos.length).toBe(2);
      expect(descuentos).toEqual(dummyDescuentos);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/descuentos`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyDescuentos);
  });

  it('debería recuperar un descuento por código', () => {
    const dummyDescuento = { id: 1, codigo: 'DESC1', valor: 10 };

    service.getDescuentoByCodigo('DESC1').subscribe((descuento) => {
      expect(descuento).toEqual(dummyDescuento);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/descuentos/DESC1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyDescuento);
  });

  it('debería recuperar un descuento por parámetro de consulta', () => {
    const dummyDescuento = { id: 1, codigo: 'DESC1', valor: 10 };

    service.getDescuentoByCodigoParam('DESC1').subscribe((descuento) => {
      expect(descuento).toEqual(dummyDescuento);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/des?codigo=DESC1`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyDescuento);
  });
});
