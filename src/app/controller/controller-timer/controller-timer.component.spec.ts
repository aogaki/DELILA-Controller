import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerTimerComponent } from './controller-timer.component';

describe('ControllerTimerComponent', () => {
  let component: ControllerTimerComponent;
  let fixture: ComponentFixture<ControllerTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControllerTimerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ControllerTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
