import { TestBed } from '@angular/core/testing';

import { DelilaService } from './delila.service';

describe('DelilaService', () => {
  let service: DelilaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DelilaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
