import { TestBed } from '@angular/core/testing';

import { PositiveNumberValidatorService } from './positive-number-validator.service';

describe('PositiveNumberValidatorService', () => {
  let service: PositiveNumberValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PositiveNumberValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
