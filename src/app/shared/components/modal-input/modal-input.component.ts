import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IModel } from '../../interfaces/imodel';
import { IApiPersonnel } from '../../interfaces/iapipersonnel';
import { ApiService } from '../../services/api.service';


export type DataModalInput = {
  title?:string,
  model?:IModel,
  type?:string
}


@Component({
  selector: 'app-modal-input',
  templateUrl: './modal-input.component.html',
  styleUrls: ['./modal-input.component.scss']
})
export class ModalInputComponent implements OnInit {

  public personnel!:string|IApiPersonnel;
  public optionsPersonnel:IApiPersonnel[] = [];

  constructor(
    public dialogRef:MatDialogRef<ModalInputComponent>,
    @Inject(MAT_DIALOG_DATA) public data:DataModalInput,
    private api:ApiService
  ) { }

  ngOnInit(): void {
    this.optionsPersonnel = this.api.data.personnels;
    this.optionsPersonnel.sort((pers1, pers2)=>{
      return pers1.firstname.localeCompare(pers2.firstname);
    })
  }

  receivePersonnel(person:any){
    this.personnel = person;
  }

  onNoClick(){
    this.dialogRef.close();
  }

  isDisabled():boolean{

    if(!this.personnel || typeof this.personnel == "string"){
      return true;
    }
    return false
  }
}
