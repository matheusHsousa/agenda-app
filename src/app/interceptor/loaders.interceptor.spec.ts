import { TestBed } from '@angular/core/testing';

import { LoadersInterceptor } from './loaders.interceptor';

describe('LoadersInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      LoadersInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: LoadersInterceptor = TestBed.inject(LoadersInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
