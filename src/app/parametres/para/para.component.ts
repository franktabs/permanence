import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModificationComponent } from '../modification/modification.component';

export interface GenSet {
  id: string;
  code: string;
  libelle: string;
  value: string;
}

const ELEMENT_DATA: GenSet[] = [
  { id: '1', libelle: 'Hydrogen', code: '1.0079', value: '' },
  { id: '2', libelle: 'Helium', code: '4.0026', value: '' },
  { id: '3', libelle: 'Lithium', code: '6.941', value: '' },
  { id: '4', libelle: 'Beryllium', code: '9.0122', value: '' },
  { id: '5', libelle: 'Boron', code: '10.811', value: '' },
  { id: '6', libelle: 'Carbon', code: '12.0107', value: '' },
  { id: '7', libelle: 'Nitrogen', code: '14.0067', value: '' },
  { id: '8', libelle: 'Oxygen', code: '15.9994', value: '' },
  { id: '9', libelle: 'Fluorine', code: '18.9984', value: '' },
  { id: '10', libelle: 'Neon', code: '20.1797', value: '' },
];

@Component({
  selector: 'app-para',
  templateUrl: './para.component.html',
  styleUrls: ['./para.component.scss'],
})
export class ParaComponent {
  displayedColumns: string[] = ['libelle', 'code', 'value'];
  dataSource = ELEMENT_DATA;
  selectedRow: GenSet | null = null;

  constructor(
    private dialog: MatDialog,
  ){}

  editValue(row: GenSet) {
    this.selectedRow = row;

    this.dialog.open(ModificationComponent, {
      data: row,
    })
  }

  onValueChanged(updatedValue: string) {
    if (this.selectedRow) {
      const clonedRow = { ...this.selectedRow }; // Create a clone of the selectedRow
      clonedRow.value = updatedValue; // Update the value property in the clonedRow

      const rowIndex = this.dataSource.indexOf(this.selectedRow); // Find the index of the selectedRow in the dataSource
      this.dataSource[rowIndex] = clonedRow; // Replace the object in the dataSource array
      ELEMENT_DATA[0].value = 'New Value';
      this.selectedRow = null; // Reset the selectedRow to null

      // Optionally, you can manually trigger change detection if necessary
      // this.cdRef.detectChanges();
    }
  }
}
