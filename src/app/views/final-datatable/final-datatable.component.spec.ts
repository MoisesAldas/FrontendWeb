import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinalDatatableComponent } from './final-datatable.component';
import { RegistroService } from '../../client/services/registro.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

describe('FinalDatatableComponent', () => {
  let component: FinalDatatableComponent;
  let fixture: ComponentFixture<FinalDatatableComponent>;
  let registroServiceSpy: jasmine.SpyObj<RegistroService>;
  let sanitizerSpy: jasmine.SpyObj<DomSanitizer>;

  beforeEach(async () => {
    const registroSpy = jasmine.createSpyObj('RegistroService', ['getAllFormularios', 'enviarCorreoAceptado', 'updateFormulario', 'enviarCorreoJuego']);
    const domSanitizerSpy = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustUrl']);

    await TestBed.configureTestingModule({
      imports: [FinalDatatableComponent, HttpClientTestingModule],
      providers: [
        { provide: RegistroService, useValue: registroSpy },
        { provide: DomSanitizer, useValue: domSanitizerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FinalDatatableComponent);
    component = fixture.componentInstance;
    registroServiceSpy = TestBed.inject(RegistroService) as jasmine.SpyObj<RegistroService>;
    sanitizerSpy = TestBed.inject(DomSanitizer) as jasmine.SpyObj<DomSanitizer>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get clients on init', () => {
    const mockClientes = [{ imagenComprobante: 'base64string', _id: '1' }];
    registroServiceSpy.getAllFormularios.and.returnValue(of(mockClientes));
    sanitizerSpy.bypassSecurityTrustUrl.and.returnValue('safe_url' as any);

    component.ngOnInit();

    expect(component.clientes.length).toBe(1);
    expect(component.clientes[0].imagenUrl).toBe('safe_url');
  });

  it('should handle error when getting clients', () => {
    registroServiceSpy.getAllFormularios.and.returnValue(throwError(() => new Error('Error')));
    spyOn(console, 'error');

    component.ngOnInit();

    expect(console.error).toHaveBeenCalled();
  });

  it('should deny client', () => {
    const mockCliente = { _id: '1', cedula: '123', email: 'test@test.com' };
    registroServiceSpy.enviarCorreoAceptado.and.returnValue(of({ msg: 'Correo enviado' }));
    registroServiceSpy.updateFormulario.and.returnValue(of({ estado: 'pendiente' }));
    spyOn(Swal, 'fire');

    component.denegarCliente(mockCliente);

    expect(registroServiceSpy.enviarCorreoAceptado).toHaveBeenCalled();
    expect(registroServiceSpy.updateFormulario).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith('Éxito', 'Correo enviado', 'success');
  });

  it('should accept client', () => {
    const mockCliente = { cedula: '123', email: 'test@test.com' };
    registroServiceSpy.enviarCorreoJuego.and.returnValue(of({ msg: 'Correo enviado' }));
    spyOn(Swal, 'fire');

    component.aceptarCliente(mockCliente);

    expect(registroServiceSpy.enviarCorreoJuego).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith('Éxito', 'Correo enviado', 'success');
  });

  it('should open modal', () => {
    component.abrirModal('test_url' as any);

    expect(component.imagenSeleccionada).toBe('test_url');
    expect(component.mostrarModal).toBeTrue();
  });

  it('should close modal', () => {
    component.cerrarModal();

    expect(component.mostrarModal).toBeFalse();
    expect(component.imagenSeleccionada).toBeNull();
  });

  it('should close modal with event', () => {
    const mockEvent = new MouseEvent('click');
    spyOn(mockEvent, 'preventDefault');

    component.cerrarModal(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(component.mostrarModal).toBeFalse();
    expect(component.imagenSeleccionada).toBeNull();
  });
});
