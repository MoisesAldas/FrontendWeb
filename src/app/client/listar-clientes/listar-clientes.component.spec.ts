import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ListarClientesComponent } from './listar-clientes.component';
import { RegistroService } from '../services/registro.service';
import { CargaritemsService } from '../services/cargaritems.service';
import Swal from 'sweetalert2';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { InnerNavbarComponent } from '../../components/inner-navbar/inner-navbar.component';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DomSanitizer } from '@angular/platform-browser';

describe('ListarClientesComponent', () => {
  let component: ListarClientesComponent;
  let fixture: ComponentFixture<ListarClientesComponent>;
  let registroService: jasmine.SpyObj<RegistroService>;
  let sanitizer: jasmine.SpyObj<DomSanitizer>;

  beforeEach(async () => {
    const registroServiceSpy = jasmine.createSpyObj('RegistroService', [
      'getAllFormularios',
      'enviarCorreoDePruebaDenegado',
      'deleteFormulario',
      'enviarCorreoAceptado',
      'updateFormulario',
    ]);
    const sanitizerSpy = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustUrl']);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RecaptchaModule,
        RecaptchaFormsModule,
        TableModule,
        InputTextModule,
        ButtonModule,
        ListarClientesComponent,
      ],
      providers: [
        { provide: RegistroService, useValue: registroServiceSpy },
        { provide: DomSanitizer, useValue: sanitizerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListarClientesComponent);
    component = fixture.componentInstance;
    registroService = TestBed.inject(RegistroService) as jasmine.SpyObj<RegistroService>;
    sanitizer = TestBed.inject(DomSanitizer) as jasmine.SpyObj<DomSanitizer>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call obtenerClientes and map clientes', () => {
      const mockClientes = [
        { imagenComprobante: 'base64string1' },
        { imagenComprobante: 'base64string2' },
      ];
      registroService.getAllFormularios.and.returnValue(of(mockClientes));
      sanitizer.bypassSecurityTrustUrl.and.returnValue('safeUrl' as any);

      component.ngOnInit();

      expect(registroService.getAllFormularios).toHaveBeenCalled();
      expect(component.clientes.length).toBe(2);
      expect(sanitizer.bypassSecurityTrustUrl).toHaveBeenCalledTimes(2);
    });

    it('should handle error when obtaining clients', () => {
      registroService.getAllFormularios.and.returnValue(throwError(() => new Error('Error')));
      spyOn(console, 'error');

      component.ngOnInit();

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('getImageUrl', () => {
    it('should return a SafeUrl', () => {
      const base64String = 'base64string';
      sanitizer.bypassSecurityTrustUrl.and.returnValue('safeUrl' as any);

      const result = component.getImageUrl(base64String);

      expect(result).toBe('safeUrl');
      expect(sanitizer.bypassSecurityTrustUrl).toHaveBeenCalledWith('data:image/jpeg;base64,base64string');
    });
  });

  describe('denegarCliente', () => {
    it('should send email and delete the form', () => {
      const cliente = { cedula: '12345', email: 'test@example.com', _id: 'id123' };
      registroService.enviarCorreoDePruebaDenegado.and.returnValue(of({}));
      registroService.deleteFormulario.and.returnValue(of({}));
      spyOn(Swal, 'fire');

      component.denegarCliente(cliente);

      expect(registroService.enviarCorreoDePruebaDenegado).toHaveBeenCalledWith(cliente.cedula, cliente.email, cliente);
      expect(registroService.deleteFormulario).toHaveBeenCalledWith(cliente._id);
      expect(Swal.fire).toHaveBeenCalledWith('Cliente Notificado', 'Formulario eliminado y cliente notificado por correo.', 'success');
    });

    it('should handle errors while sending email', () => {
      const cliente = { cedula: '12345', email: 'test@example.com' };
      registroService.enviarCorreoDePruebaDenegado.and.returnValue(throwError(() => new Error('Error')));
      spyOn(Swal, 'fire');
      spyOn(console, 'error');

      component.denegarCliente(cliente);

      expect(console.error).toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalledWith('Error', 'No se pudo enviar el correo', 'error');
    });

    it('should handle errors while deleting form', () => {
      const cliente = { cedula: '12345', email: 'test@example.com', _id: 'id123' };
      registroService.enviarCorreoDePruebaDenegado.and.returnValue(of({}));
      registroService.deleteFormulario.and.returnValue(throwError(() => new Error('Error')));
      spyOn(Swal, 'fire');
      spyOn(console, 'error');

      component.denegarCliente(cliente);

      expect(console.error).toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalledWith('Error', 'No se pudo eliminar el formulario', 'error');
    });
  });

  describe('aceptarCliente', () => {
    it('should send email and update the form', () => {
      const cliente = { cedula: '12345', email: 'test@example.com', _id: 'id123' };
      const response = { msg: 'Cliente aceptado' };
      registroService.enviarCorreoAceptado.and.returnValue(of(response));
      registroService.updateFormulario.and.returnValue(of({ estado: 'Aceptado' }));
      spyOn(Swal, 'fire');

      component.aceptarCliente(cliente);

      expect(registroService.enviarCorreoAceptado).toHaveBeenCalledWith(cliente.cedula, cliente.email, cliente);
      expect(registroService.updateFormulario).toHaveBeenCalledWith(cliente._id, { estado: 'Aceptado' });
      expect(Swal.fire).toHaveBeenCalledWith('Éxito', response.msg, 'success');
    });

    it('should handle errors while sending email', () => {
      const cliente = { cedula: '12345', email: 'test@example.com' };
      registroService.enviarCorreoAceptado.and.returnValue(throwError(() => new Error('Error')));
      spyOn(Swal, 'fire');
      spyOn(console, 'error');

      component.aceptarCliente(cliente);

      expect(console.error).toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalledWith('Éxito', 'success');
    });

    it('should handle errors while updating form', () => {
      const cliente = { cedula: '12345', email: 'test@example.com', _id: 'id123' };
      const response = { msg: 'Cliente aceptado' };
      registroService.enviarCorreoAceptado.and.returnValue(of(response));
      registroService.updateFormulario.and.returnValue(throwError(() => new Error('Error')));
      spyOn(Swal, 'fire');
      spyOn(console, 'error');

      component.aceptarCliente(cliente);

      expect(console.error).toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalledWith('Éxito', response.msg, 'success');
    });
  });
});
