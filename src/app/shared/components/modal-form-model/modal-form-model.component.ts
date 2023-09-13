import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TitleCard1 } from '../card1/card1.component';
import { IApiPersonnel } from '../../interfaces/iapipersonnel';
import { OptionalKey, OptionalKeyString } from '../../utils/type';


export type DataDialogModalFormModelComponent = {titre:TitleCard1, dataForm:OptionalKeyString<IApiPersonnel>} 

@Component({
  selector: 'app-modal-form-model',
  templateUrl: './modal-form-model.component.html',
  styleUrls: ['./modal-form-model.component.scss']
})
export class ModalFormModelComponent implements OnInit {

  @Input() iconTitle!:string;

  public dataForm:OptionalKeyString<IApiPersonnel>;


  constructor(public dialogRef: MatDialogRef<ModalFormModelComponent>, @Inject(MAT_DIALOG_DATA) public data : DataDialogModalFormModelComponent) { 
    this.dataForm = data.dataForm;
  }

  ngOnInit(): void {
  }

  onNoClick(){
    this.dialogRef.close()
  }

}
