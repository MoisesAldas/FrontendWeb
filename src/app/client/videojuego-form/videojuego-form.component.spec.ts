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
    control?.setValue('1234567890');
    expect(control?.invalid).toBeTruthy();

    control?.setValue('1720018237'); // A valid example
    expect(control?.valid).toBeTruthy();
  });

  it('should disable fields on initialization', () => {
    expect(component.form.get('precio')?.disabled).toBeTrue();
    expect(component.form.get('subtotal')?.disabled).toBeTrue();
    expect(component.form.get('total')?.disabled).toBeTrue();
  });

  it('should update prices when videojuego changes', () => {
    mockCargaritemsService.getAllVideojuegos.and.returnValue(of([
      { nombre: 'Juego A', precio: 10 },
      { nombre: 'Juego B', precio: 20 }
    ]));

    component.ngOnInit();

    const videojuegoControl = component.form.get('videojuego');
    videojuegoControl?.setValue('Juego A');

    expect(component.form.get('precio')?.value).toBe(10);
    expect(component.form.get('subtotal')?.value).toBe(10);
    expect(component.form.get('total')?.value).toBe(10);
  });

  it('should update total when discount code is applied', () => {
    mockCargaritemsService.getDescuentoByCodigo.and.returnValue(of({ porcentaje: 10 }));

    component.form.get('precio')?.setValue(100);
    component.form.get('codigoDescuento')?.setValue('DISCOUNT10');

    component.actualizarTotal();

    expect(component.form.get('subtotal')?.value).toBe(90);
    expect(component.form.get('total')?.value).toBe(90);
  });

  it('should set captchaValid to true when resolved is called with a non-null response', () => {
    component.resolved('valid-captcha');
    expect(component.captchaValid).toBeTrue();
    expect(component.form.get('captcha')?.value).toBe('valid-captcha');
  });

  it('should submit the form successfully if the form is valid and captcha is valid', () => {
    mockRegistroService.createFormulario.and.returnValue(of({}));
    spyOn(component.form, 'reset');

    component.captchaValid = true;
    component.form.get('nombre')?.setValue('John Doe');
    component.form.get('email')?.setValue('john@example.com');
    component.form.get('cedula')?.setValue('1720018237');
    component.form.get('telefono')?.setValue('0999999999');
    component.form.get('videojuego')?.setValue('Juego A');
    component.form.get('precio')?.setValue(100);
    component.form.get('subtotal')?.setValue(100);
    component.form.get('total')?.setValue(100);
    component.form.get('captcha')?.setValue('valid-captcha');

    component.onSubmit();

    expect(mockRegistroService.createFormulario).toHaveBeenCalled();
    expect(component.form.reset).toHaveBeenCalled();
  });

  it('should not submit the form if it is invalid', () => {
    spyOn(component.form, 'markAllAsTouched');

    component.captchaValid = true;
    component.onSubmit();

    expect(mockRegistroService.createFormulario).not.toHaveBeenCalled();
    expect(component.form.markAllAsTouched).toHaveBeenCalled();
  });
});
