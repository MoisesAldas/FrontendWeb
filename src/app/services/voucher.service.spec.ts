import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { VoucherService } from './voucher.service';

describe('VoucherService', () => {
  let service: VoucherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VoucherService]
    });
    service = TestBed.inject(VoucherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should upload a voucher successfully', () => {
    const mockResponse = { success: true, message: 'Comprobante subido con éxito' };
    const mockCedula = '1234567890';
    const mockFile = new File(['dummy content'], 'example.png', { type: 'image/png' });

    service.uploadVoucher(mockCedula, mockFile).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/voucher/uploadVoucher/${mockCedula}`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse); // Simula una respuesta exitosa del servidor
  });

  it('should handle an error response correctly', () => {
    const mockError = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404,
      statusText: 'Not Found'
    });

    const mockCedula = '1234567890';
    const mockFile = new File(['dummy content'], 'example.png', { type: 'image/png' });

    service.uploadVoucher(mockCedula, mockFile).subscribe(
      () => fail('should have failed with the 404 error'),
      (error: string) => {
        expect(error).toContain('Error Code: 404');
      }
    );

    const req = httpMock.expectOne(`${service['apiUrl']}/voucher/uploadVoucher/${mockCedula}`);
    req.flush('test 404 error', { status: 404, statusText: 'Not Found' }); // Simula una respuesta de error del servidor
  });
});
