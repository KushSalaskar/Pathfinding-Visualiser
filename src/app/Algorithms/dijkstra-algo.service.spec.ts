import { TestBed } from '@angular/core/testing';

import { DijkstraAlgoService } from './dijkstra-algo.service';

describe('DijkstraAlgoService', () => {
  let service: DijkstraAlgoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DijkstraAlgoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
