import { TestBed } from '@angular/core/testing';

import { DFSAlgoService } from './dfs-algo.service';

describe('DFSAlgoService', () => {
  let service: DFSAlgoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DFSAlgoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
