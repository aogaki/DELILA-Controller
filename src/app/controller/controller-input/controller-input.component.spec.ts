import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerInputComponent } from './controller-input.component';

describe('ControllerInputComponent', () => {
  let component: ControllerInputComponent;
  let fixture: ComponentFixture<ControllerInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControllerInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ControllerInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
