import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Tabla1Component } from './tabla1.component';

import Swal, { SweetAlertResult } from 'sweetalert2';



describe('Tabla1Component', () => {
  let component: Tabla1Component;
  let fixture: ComponentFixture<Tabla1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tabla1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tabla1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('calcularTotal', () => {
    it('should calculate the total with a 10% discount', () => {
      const precio = 100;
      const total = component.calcularTotal(precio);
      expect(total).toBe(90);
    });
  });

  describe('aceptarRegistro', () => {
    it('should accept the record and update the state to "aceptado"', () => {
      const swalSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as SweetAlertResult<unknown>));
      const index = 0;
      component.aceptarRegistro(index);

      expect(swalSpy).toHaveBeenCalled();
      swalSpy.calls.mostRecent().returnValue.then(() => {
        expect(component.datos[index].estado).toBe('aceptado');
      });
    });

    it('should not change the state if user cancels the action', () => {
      const swalSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: false, isDenied: false, isDismissed: true }));
      const index = 0;
      component.aceptarRegistro(index);

      expect(swalSpy).toHaveBeenCalled();
      swalSpy.calls.mostRecent().returnValue.then(() => {
        expect(component.datos[index].estado).toBe('');
      });
    });
  });

  describe('denegarRegistro', () => {
    it('should deny the record and update the state to "denegado"', () => {
      const swalSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true, isDenied: false, isDismissed: false }));
      const index = 1;
      component.denegarRegistro(index);

      expect(swalSpy).toHaveBeenCalled();
      swalSpy.calls.mostRecent().returnValue.then(() => {
        expect(component.datos[index].estado).toBe('denegado');
      });
    });

    it('should not change the state if user cancels the action', () => {
      const swalSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: false, isDenied: false, isDismissed: true }));
      const index = 1;
      component.denegarRegistro(index);

      expect(swalSpy).toHaveBeenCalled();
      swalSpy.calls.mostRecent().returnValue.then(() => {
        expect(component.datos[index].estado).toBe('');
      });
    });
  });
});
