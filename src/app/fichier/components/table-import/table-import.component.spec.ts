import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableImportComponent } from './table-import.component';

describe('TableImportComponent', () => {
  let component: TableImportComponent;
  let fixture: ComponentFixture<TableImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableImportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
