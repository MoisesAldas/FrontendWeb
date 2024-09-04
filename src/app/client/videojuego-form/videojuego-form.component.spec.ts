import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { VideojuegoFormComponent } from './videojuego-form.component';
import { RegistroService } from '../services/registro.service';
import { CargaritemsService } from '../services/cargaritems.service';

describe('VideojuegoFormComponent', () => {
  let component: VideojuegoFormComponent;
  let fixture: ComponentFixture<VideojuegoFormComponent>;
  let mockRegistroService: jasmine.SpyObj<RegistroService>;
  let mockCargaritemsService: jasmine.SpyObj<CargaritemsService>;

  beforeEach(waitForAsync(() => {
    mockRegistroService = jasmine.createSpyObj('RegistroService', ['createFormulario']);
    mockCargaritemsService = jasmine.createSpyObj('CargaritemsService', ['getAllVideojuegos', 'getDescuentoByCodigo']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, VideojuegoFormComponent],
      providers: [
        { provide: RegistroService, useValue: mockRegistroService },
        { provide: CargaritemsService, useValue: mockCargaritemsService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideojuegoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.form).toBeDefined();
    expect(component.form.get('nombre')?.value).toBe('');
    expect(component.form.get('email')?.value).toBe('');
  });

  it('should validate Ecuadorian cedula correctly', () => {
    const control = component.form.get('cedula');

    control?.setValue('2350337629');
    expect(control?.invalid).toBeTruthy();

    control?.setValue('2350337628');
    expect(control?.valid).toBeTruthy();
  });

  it('should disable fields on initialization', () => {
    expect(component.form.get('precio')?.disabled).toBeTrue();
    expect(component.form.get('subtotal')?.disabled).toBeTrue();
    expect(component.form.get('total')?.disabled).toBeTrue();
  });

  it('should set captchaValid to true when resolved is called with a non-null response', () => {
    component.resolved('valid-captcha');
    expect(component.captchaValid).toBeTrue();
    expect(component.form.get('captcha')?.value).toBe('valid-captcha');
  });

  it('should not submit the form if it is invalid', () => {
    spyOn(component.form, 'markAllAsTouched');

    component.captchaValid = true;
    component.onSubmit();

    expect(mockRegistroService.createFormulario).not.toHaveBeenCalled();
    expect(component.form.markAllAsTouched).toHaveBeenCalled();
  });
});
