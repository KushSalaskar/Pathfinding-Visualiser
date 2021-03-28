import { TestBed } from '@angular/core/testing';

import { AstarAlgoService } from './astar-algo.service';

describe('AstarAlgoService', () => {
  let service: AstarAlgoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AstarAlgoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
