import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TitleCard1 } from '../card1/card1.component';
import { IApiPersonnel } from '../../interfaces/iapipersonnel';
import { OptionalKey, OptionalKeyString } from '../../utils/type';
import { IApiDepartement } from '../../interfaces/iapidepartement';
import DepartementRequest from '../../models/model-request/DepartementRequest';
import axios from 'axios';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


export type DataDialogModalFormModelComponent = {titre:TitleCard1, dataForm:OptionalKeyString<IApiPersonnel>, icon:string } 

const VIEW_INPUT:Array<keyof OptionalKeyString<IApiPersonnel>> = ["emailaddress", "firstname", "sexe", "organizationId"];

@Component({
  selector: 'app-modal-form-model',
  templateUrl: './modal-form-model.component.html',
  styleUrls: ['./modal-form-model.component.scss']
})
export class ModalFormModelComponent implements OnInit {

  public iconTitle!:string;

  public dataForm:OptionalKeyString<IApiPersonnel>;

  public dataViewHtml!:any;

  public departementRequest:DepartementRequest<IApiDepartement[]> = new DepartementRequest([]);

  public typeInput:{simple:Array<typeof VIEW_INPUT[number]>} = {simple:["firstname" ]};

  public myFormGroup!:FormGroup;


  constructor(public dialogRef: MatDialogRef<ModalFormModelComponent>, @Inject(MAT_DIALOG_DATA) public data : DataDialogModalFormModelComponent, public api:ApiService, public formBuilder:FormBuilder) { 
    this.dataForm = data.dataForm;
    this.iconTitle = data.icon;


    
  }

  ngOnInit(): void {

    let elemntGroup: {[key in keyof typeof this.dataForm]: any} = {};
    
    for(let key in this.dataForm){
      let cle:keyof typeof this.dataForm = key as any;
      if(cle=="emailaddress"){
        elemntGroup.emailaddress = [this.dataForm.emailaddress, Validators.compose([Validators.email, Validators.required])]
      }else {
        elemntGroup[cle] = [this.dataForm[cle], Validators.required]
      }
    }
    this.myFormGroup = this.formBuilder.group(elemntGroup);
    this.dataViewHtml = JSON.parse(JSON.stringify(this.dataForm));
    if((<(keyof OptionalKeyString<IApiPersonnel>)[]>Object.keys(this.dataForm)).includes("organizationId")){
      this.initDepartementList();
    }
  }

  onNoClick(){
    this.dialogRef.close()
  }

  isSimpleInput(key:string){
    return this.typeInput.simple.includes(key as any);
  }

  async  initDepartementList(){
    try{
      this.departementRequest.loading();
      let response = await axios.get(this.api.URL_DEPARTEMENTS);
      if(response.data){
        this.departementRequest.data = response.data;
        this.departementRequest.success();
      }
    }catch(e){
      console.error("voici l'erreur ", e );
      this.departementRequest.error();
    }
  }

  enregistrer(){
    console.log(this.myFormGroup.value);
  }

  testEmail():boolean{
    let result = this.myFormGroup.controls['emailaddress'];
    console.log("le champs email est ", result);
    return !!result;
  }

}
