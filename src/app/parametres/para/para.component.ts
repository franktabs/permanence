;import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { ModificationComponent } from '../modification/modification.component';

export interface GenSet {
  id: string;
  code: string;
  libelle: string;
  value: string;
}

@Component({
  selector: 'app-para',
  templateUrl: './para.component.html',
  styleUrls: ['./para.component.scss'],
})
export class ParaComponent implements OnInit {
  displayedColumns: string[] = ['libelle', 'value'];
  dataSource: GenSet[] = [];
  selectedRow: GenSet | null = null;

  constructor(
    private dialog: MatDialog,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.http.get<GenSet[]>('/assets/data.json').subscribe((data: GenSet[]) => {
      this.dataSource = data;
    });
  }

  editValue(row: GenSet) {
    this.selectedRow = row;

    this.dialog.open(ModificationComponent, {
      data: row,
    });
  }

  onValueChanged(updatedValue: string) {
    if (this.selectedRow) {
      const clonedRow = { ...this.selectedRow };
      clonedRow.value = updatedValue;

      const rowIndex = this.dataSource.indexOf(this.selectedRow);
      this.dataSource[rowIndex] = clonedRow;
      this.selectedRow = null;
    }
  }
}