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

  describe('getImageUrl', () => {
    it('should return a SafeUrl', () => {
      const base64String = 'base64string';
      sanitizer.bypassSecurityTrustUrl.and.returnValue('safeUrl' as any);

      const result = component.getImageUrl(base64String);

      expect(result).toBe('safeUrl');
      expect(sanitizer.bypassSecurityTrustUrl).toHaveBeenCalledWith('data:image/jpeg;base64,base64string');
    });
  });
});
