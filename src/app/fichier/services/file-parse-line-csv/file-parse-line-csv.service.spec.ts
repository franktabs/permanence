import { TestBed } from '@angular/core/testing';

import { FileParseLineCSVService } from './file-parse-line-csv.service';

describe('FileParseLineCSVService', () => {
  let service: FileParseLineCSVService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileParseLineCSVService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
