import { TestBed } from '@angular/core/testing';

import { BidirectionalSwarmAlgoService } from './bidirectional-swarm-algo.service';

describe('BidirectionalSwarmAlgoService', () => {
  let service: BidirectionalSwarmAlgoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BidirectionalSwarmAlgoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
