import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideojuegoActualizarComponent } from './videojuego-actualizar.component';

describe('VideojuegoActualizarComponent', () => {
  let component: VideojuegoActualizarComponent;
  let fixture: ComponentFixture<VideojuegoActualizarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideojuegoActualizarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideojuegoActualizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
