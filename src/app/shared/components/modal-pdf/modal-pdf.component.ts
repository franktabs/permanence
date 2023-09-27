import { Component, Inject, OnInit } from '@angular/core';
import IJasperModel from '../../interfaces/ijasperModel';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


export type DataModalPdf = {
  title:string;
}

@Component({
  selector: 'app-modal-pdf',
  templateUrl: './modal-pdf.component.html',
  styleUrls: ['./modal-pdf.component.scss']
})
export class ModalPdfComponent implements OnInit {

  public jasperModel:IJasperModel = {title:""}

  constructor(
    public dialogRef: MatDialogRef<ModalPdfComponent>,
    @Inject(MAT_DIALOG_DATA) public data:DataModalPdf ,
  ) { }

  ngOnInit(): void {
    
  }

  onNoClick(){
    this.dialogRef.close()
  }

}
