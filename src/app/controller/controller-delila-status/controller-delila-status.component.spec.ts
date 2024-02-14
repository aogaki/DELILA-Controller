import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerDelilaStatusComponent } from './controller-delila-status.component';

describe('ControllerDelilaStatusComponent', () => {
  let component: ControllerDelilaStatusComponent;
  let fixture: ComponentFixture<ControllerDelilaStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControllerDelilaStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ControllerDelilaStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
