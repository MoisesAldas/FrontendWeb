import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { IndexComponent } from './index.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';

describe('IndexComponent', () => {
  let component: IndexComponent;
  let fixture: ComponentFixture<IndexComponent>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [IndexComponent, CommonModule, NavbarComponent],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(IndexComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a list of featured games', () => {
    expect(component.featuredGames.length).toBeGreaterThan(0);
    expect(component.featuredGames[0]).toEqual(
      jasmine.objectContaining({
        name: 'The Last of Us',
        image: 'https://uvejuegos.com/img/caratulas/46761/TLOU%20Francia.jpg',
        description: 'Un juego de supervivencia en un mundo post-apocalíptico',
      })
    );
  });

  describe('Navigation', () => {
    it('should navigate to catalogo page', () => {
      component.goToCatalogo();
      expect(router.navigate).toHaveBeenCalledWith(['/catalogo']);
    });

    it('should navigate to formulario page', () => {
      component.goToFormulario();
      expect(router.navigate).toHaveBeenCalledWith(['/videojuego-form']);
    });
  });
});
