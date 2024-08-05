import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InnerNavbarComponent  } from './inner-navbar.component';

describe('NavbarComponent', () => {
  let component: InnerNavbarComponent ;
  let fixture: ComponentFixture<InnerNavbarComponent >;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InnerNavbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InnerNavbarComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
