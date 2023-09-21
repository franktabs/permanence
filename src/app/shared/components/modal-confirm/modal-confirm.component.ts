import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


export type DataModalConfirm = {title:string, content:string}

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss']
})
export class ModalConfirmComponent implements OnInit {

  constructor(
    public dialogRef:MatDialogRef<ModalConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data:DataModalConfirm,
  ) { }

  ngOnInit(): void {
  }


  onNoClick(){
    this.dialogRef.close();
  }
}
