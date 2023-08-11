import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { GenSet } from '../para/para.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modification',
  templateUrl: './modification.component.html',
  styleUrls: ['./modification.component.scss']
})
export class ModificationComponent {
  public value: string = '';
  @Output() valueChanged = new EventEmitter<string>();


  constructor(
    public dialogRef: MatDialogRef<ModificationComponent>,
    @Inject(MAT_DIALOG_DATA) public row: GenSet
  ) {
    
  }

  updateValue() {
    this.row.value = this.value;
    this.dialogRef.close();
  }
}