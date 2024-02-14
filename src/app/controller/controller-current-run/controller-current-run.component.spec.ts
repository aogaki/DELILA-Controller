import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerCurrentRunComponent } from './controller-current-run.component';

describe('ControllerCurrentRunComponent', () => {
  let component: ControllerCurrentRunComponent;
  let fixture: ComponentFixture<ControllerCurrentRunComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControllerCurrentRunComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ControllerCurrentRunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
