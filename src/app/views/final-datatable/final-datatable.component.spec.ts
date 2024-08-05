import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalDatatableComponent } from './final-datatable.component';

describe('FinalDatatableComponent', () => {
  let component: FinalDatatableComponent;
  let fixture: ComponentFixture<FinalDatatableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinalDatatableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinalDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
