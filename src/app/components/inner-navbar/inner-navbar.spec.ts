import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { InnerNavbarComponent } from './inner-navbar.component';

describe('InnerNavbarComponent', () => {
  let component: InnerNavbarComponent;
  let fixture: ComponentFixture<InnerNavbarComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [InnerNavbarComponent],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(InnerNavbarComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Navigation Methods', () => {
    it('should navigate to tabla1 page', () => {
      component.goToTabla1();
      expect(router.navigate).toHaveBeenCalledWith(['/', 'tabla1']);
    });

    it('should navigate to final-datatable page', () => {
      component.goToTablafinal();
      expect(router.navigate).toHaveBeenCalledWith(['/', 'final-datatable']);
    });

    it('should navigate to ListarClientes page', () => {
      component.goToClientes();
      expect(router.navigate).toHaveBeenCalledWith(['/', 'ListarClientes']);
    });

    it('should navigate to login page on logout', () => {
      component.logout();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
