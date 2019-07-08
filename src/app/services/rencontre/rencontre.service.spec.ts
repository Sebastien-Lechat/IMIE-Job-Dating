import { TestBed } from '@angular/core/testing';

import { RencontreService } from './rencontre.service';

describe('RencontreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RencontreService = TestBed.get(RencontreService);
    expect(service).toBeTruthy();
  });
});
