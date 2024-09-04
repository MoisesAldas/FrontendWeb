import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Navigation Methods', () => {
    it('should navigate to index page', () => {
      component.goToIndex();
      expect(router.navigate).toHaveBeenCalledWith(['/', 'index']);
    });

    it('should navigate to catalogo page', () => {
      component.goToCatalogo();
      expect(router.navigate).toHaveBeenCalledWith(['/', 'catalogo']);
    });

    it('should navigate to formulario page', () => {
      component.goToFormulario();
      expect(router.navigate).toHaveBeenCalledWith(['/', 'videojuego-form']);
    });

    it('should navigate to login page on logout', () => {
      component.logout();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
