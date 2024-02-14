import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerRunListComponent } from './controller-run-list.component';

describe('ControllerRunListComponent', () => {
  let component: ControllerRunListComponent;
  let fixture: ComponentFixture<ControllerRunListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControllerRunListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ControllerRunListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
