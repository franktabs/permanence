import { Component, OnInit } from '@angular/core';
import IJasperModel from '../../interfaces/ijasperModel';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-pdf',
  templateUrl: './modal-pdf.component.html',
  styleUrls: ['./modal-pdf.component.scss']
})
export class ModalPdfComponent implements OnInit {

  public jasperModel:IJasperModel = {title:""}

  constructor(
    public dialogRef: MatDialogRef<ModalPdfComponent>,
  ) { }

  ngOnInit(): void {
  }

  onNoClick(){
    this.dialogRef.close()
  }

}
