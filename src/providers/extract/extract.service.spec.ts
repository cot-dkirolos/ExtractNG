/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ExtractService } from './extract.service';

describe('Service: Extract', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExtractService]
    });
  });

  it('should ...', inject([ExtractService], (service: ExtractService) => {
    expect(service).toBeTruthy();
  }));
});