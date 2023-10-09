import { TestBed } from '@angular/core/testing';

import { FileParseColCSVService } from './file-parse-col-csv.service';

describe('FileParseColCSVService', () => {
  let service: FileParseColCSVService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileParseColCSVService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
