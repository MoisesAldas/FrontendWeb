import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ListarClientesComponent } from './listar-clientes.component';
import { RegistroService } from '../services/registro.service';
import { CargaritemsService } from '../services/cargaritems.service';
import Swal from 'sweetalert2';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { InnerNavbarComponent } from '../../components/inner-navbar/inner-navbar.component';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

describe('ListarClientesComponent', () => {
  let component: ListarClientesComponent;
  let fixture: ComponentFixture<ListarClientesComponent>;
  let registroService: jasmine.SpyObj<RegistroService>;
  let cargaritemsService: jasmine.SpyObj<CargaritemsService>;

  beforeEach(async () => {
    const registroServiceSpy = jasmine.createSpyObj('RegistroService', [
      'getAllFormularios',
      'enviarCorreoDePruebaDenegado',
      'deleteFormulario',
      'enviarCorreoAceptado',
      'updateFormulario',
    ]);
    const cargaritemsServiceSpy = jasmine.createSpyObj('CargaritemsService', [
      'someMethod',
    ]); // Add necessary methods

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RecaptchaModule,
        RecaptchaFormsModule,
        TableModule,
        InputTextModule,
        ButtonModule,
      ],
      declarations: [ListarClientesComponent, InnerNavbarComponent],
      providers: [
        { provide: RegistroService, useValue: registroServiceSpy },
        { provide: CargaritemsService, useValue: cargaritemsServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListarClientesComponent);
    component = fixture.componentInstance;
    registroService = TestBed.inject(
      RegistroService
    ) as jasmine.SpyObj<RegistroService>;
    cargaritemsService = TestBed.inject(
      CargaritemsService
    ) as jasmine.SpyObj<CargaritemsService>;
    fixture.detectChanges();
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

      component.ngOnInit();

      expect(registroService.getAllFormularios).toHaveBeenCalled();
      expect(component.clientes.length).toBe(2);
    });
  });

  describe('getImageUrl', () => {
    it('should return a SafeUrl', () => {
      const base64String = 'base64string';
      const safeUrl = component.getImageUrl(base64String);

      expect(safeUrl).toBeDefined();
    });
  });

  describe('denegarCliente', () => {
    it('should send email and delete the form', () => {
      const cliente = {
        cedula: '12345',
        email: 'test@example.com',
        _id: 'id123',
      };
      registroService.enviarCorreoDePruebaDenegado.and.returnValue(of({}));
      registroService.deleteFormulario.and.returnValue(of({}));

      spyOn(Swal, 'fire');

      component.denegarCliente(cliente);

      expect(registroService.enviarCorreoDePruebaDenegado).toHaveBeenCalledWith(
        cliente.cedula,
        cliente.email,
        cliente
      );
      expect(registroService.deleteFormulario).toHaveBeenCalledWith(
        cliente._id
      );
      expect(Swal.fire).toHaveBeenCalledWith(
        'Cliente Notificado',
        'Formulario eliminado y cliente notificado por correo.',
        'success'
      );
    });

    it('should handle errors while sending email', () => {
      const cliente = { cedula: '12345', email: 'test@example.com' };
      registroService.enviarCorreoDePruebaDenegado.and.returnValue(
        throwError(() => new Error('Error'))
      );

      spyOn(Swal, 'fire');

      component.denegarCliente(cliente);

      expect(Swal.fire).toHaveBeenCalledWith(
        'Error',
        'No se pudo enviar el correo',
        'error'
      );
    });
  });

  describe('aceptarCliente', () => {
    it('should send email and update the form', () => {
      const cliente = {
        cedula: '12345',
        email: 'test@example.com',
        _id: 'id123',
      };
      const response = { msg: 'Cliente aceptado' };
      registroService.enviarCorreoAceptado.and.returnValue(of(response));
      registroService.updateFormulario.and.returnValue(
        of({ estado: 'Aceptado' })
      );

      spyOn(Swal, 'fire');

      component.aceptarCliente(cliente);

      expect(registroService.enviarCorreoAceptado).toHaveBeenCalledWith(
        cliente.cedula,
        cliente.email,
        cliente
      );
      expect(registroService.updateFormulario).toHaveBeenCalledWith(
        cliente._id,
        { estado: 'Aceptado' }
      );
      expect(Swal.fire).toHaveBeenCalledWith('Éxito', response.msg, 'success');
    });

    it('should handle errors while sending email', () => {
      const cliente = { cedula: '12345', email: 'test@example.com' };
      registroService.enviarCorreoAceptado.and.returnValue(
        throwError(() => new Error('Error'))
      );

      spyOn(Swal, 'fire');

      component.aceptarCliente(cliente);

      expect(Swal.fire).toHaveBeenCalledWith('Éxito', 'success');
    });
  });
});
