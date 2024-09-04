import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoucherComponent } from './voucher.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { NgxImageCompressService } from 'ngx-image-compress';
import { VoucherService } from '../../services/voucher.service';

describe('VoucherComponent', () => {
  let component: VoucherComponent;
  let fixture: ComponentFixture<VoucherComponent>;
  let voucherServiceSpy: jasmine.SpyObj<VoucherService>;
  let imageCompressSpy: jasmine.SpyObj<NgxImageCompressService>;

  beforeEach(async () => {
    const voucherSpy = jasmine.createSpyObj('VoucherService', [
      'uploadVoucher',
    ]);
    const imageCompress = jasmine.createSpyObj('NgxImageCompressService', [
      'compressFile',
      'getOrientation',
    ]);

    await TestBed.configureTestingModule({
      imports: [VoucherComponent],
      providers: [
        { provide: VoucherService, useValue: voucherSpy },
        { provide: NgxImageCompressService, useValue: imageCompress },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: () => '2350337628', // Simular la cédula
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VoucherComponent);
    component = fixture.componentInstance;
    voucherServiceSpy = TestBed.inject(
      VoucherService
    ) as jasmine.SpyObj<VoucherService>;
    imageCompressSpy = TestBed.inject(
      NgxImageCompressService
    ) as jasmine.SpyObj<NgxImageCompressService>;
    fixture.detectChanges();
  });




  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the cedula on init', () => {
    expect(component.cedula).toBe('2350337628');
  });

  describe('onButtonClick', () => {
    it('should show a warning if no file is selected', () => {
      const swalSpy = spyOn(Swal, 'fire').and.callThrough();

      component.file = null;
      component.onButtonClick();

      expect(swalSpy).toHaveBeenCalledWith(
        jasmine.objectContaining({
          icon: 'warning',
          title: 'Archivo no seleccionado',
          text: 'Por favor, sube un archivo antes de enviar.',
        })
      );
    });

    it('should upload the voucher and show success message', () => {
      const swalSpy = spyOn(Swal, 'fire').and.callThrough();
      const file = new File(['image content'], 'test.jpg', {
        type: 'image/jpeg',
      });
      component.file = file;
      component.cedula = '2350337628';

      voucherServiceSpy.uploadVoucher.and.returnValue(of({}));

      component.onButtonClick();

      expect(voucherServiceSpy.uploadVoucher).toHaveBeenCalledWith(
        '2350337628',
        file
      );
      expect(swalSpy).toHaveBeenCalledWith(
        jasmine.objectContaining({
          icon: 'success',
          title: 'Comprobante subido',
          text: 'Comprobante subido con éxito',
        })
      );
    });

    it('should show an error if upload fails', () => {
      const swalSpy = spyOn(Swal, 'fire').and.callThrough();
      const file = new File(['image content'], 'test.jpg', {
        type: 'image/jpeg',
      });
      component.file = file;
      component.cedula = '2350337628';

      voucherServiceSpy.uploadVoucher.and.returnValue(of({}));

      component.onButtonClick();

      expect(voucherServiceSpy.uploadVoucher).toHaveBeenCalledWith(
        '2350337628',
        file
      );
      expect(swalSpy).toHaveBeenCalledWith(
        jasmine.objectContaining({
          icon: 'success',
          title: 'Comprobante subido',
          text: 'Comprobante subido con éxito',
        })
      );
    });
  });
});
