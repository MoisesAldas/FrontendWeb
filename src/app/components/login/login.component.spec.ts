import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule, ReactiveFormsModule],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should navigate to ListarClientes on successful login', () => {
      component.username = 'usuario1';
      component.password = 'contraseña1';
      component.onSubmit();
      expect(router.navigate).toHaveBeenCalledWith(['/', 'ListarClientes']);
    });

    it('should set loginFailed to true on incorrect credentials', () => {
      component.username = 'usuario1';
      component.password = 'wrongpassword';
      component.onSubmit();
      expect(component.loginFailed).toBeTrue();
    });

    it('should log an error when no username or password is provided', () => {
      spyOn(console, 'error');
      component.username = '';
      component.password = '';
      component.onSubmit();
      expect(console.error).toHaveBeenCalledWith('Formulario no válido');
    });
  });

  describe('loginAsClient', () => {
    it('should navigate to index page', () => {
      component.loginAsClient();
      expect(router.navigate).toHaveBeenCalledWith(['/', 'index']);
    });
  });
});
