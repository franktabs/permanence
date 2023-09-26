import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IModel } from '../../interfaces/imodel';
import { IApiPersonnel } from '../../interfaces/iapipersonnel';
import { ApiService } from '../../services/api.service';
import ICritere from '../../interfaces/icritere';
import { filterOffAdmin } from '../../utils/function';


export type DataModalInput = {
  title?:string,
  model?:IModel,
  type:"PERSONNEL"|"CRITERE",
  critere_object?:typeof CRITERE_OBJECT
}

export const CRITERE_OBJECT:{[key in ICritere["nom"]]: boolean} = {"RESPONSABLE TFG":false ,"APPARAIT WEEKEND":false ,"SUPERVISEUR":false ,"APPARAIT LUNDI - VENDREDI ":false ,"REPARTI NORMALEMENT":false, "APPARAIT DIMANCHE":false, "APPARAIT SAMEDI":false}
export const CRITERES: (keyof typeof CRITERE_OBJECT)[] = ["RESPONSABLE TFG" ,"APPARAIT WEEKEND" ,"SUPERVISEUR" ,"APPARAIT LUNDI - VENDREDI " ,"REPARTI NORMALEMENT", "APPARAIT SAMEDI", "APPARAIT DIMANCHE"]


@Component({
  selector: 'app-modal-input',
  templateUrl: './modal-input.component.html',
  styleUrls: ['./modal-input.component.scss']
})
export class ModalInputComponent implements OnInit {

  public personnel!:string|IApiPersonnel;
  public criteres_object:typeof CRITERE_OBJECT= CRITERE_OBJECT;
  public initial_critere_object!:typeof CRITERE_OBJECT;
  public criteres: (keyof typeof CRITERE_OBJECT)[] = CRITERES;
  public optionsPersonnel:IApiPersonnel[] = [];
  public addAllOtherPersonnel:boolean = false;

  constructor(
    public dialogRef:MatDialogRef<ModalInputComponent>,
    @Inject(MAT_DIALOG_DATA) public data:DataModalInput,
    private api:ApiService
  ) { }

  ngOnInit(): void {
    if(this.data.type=="PERSONNEL"){
      this.optionsPersonnel = filterOffAdmin(this.api.data.personnels);
      this.optionsPersonnel.sort((pers1, pers2)=>{
        return pers1.firstname.localeCompare(pers2.firstname);
      })
    }else if (this.data.type=="CRITERE"){
      if(this.data.critere_object){
        this.criteres_object = JSON.parse(JSON.stringify(this.data.critere_object));
        this.initial_critere_object = JSON.parse(JSON.stringify(this.criteres_object));

      }
    }
  }

  receivePersonnel(person:any){
    this.personnel = person;
  }

  onNoClick(){
    this.dialogRef.close();
  }

  isDisabled():boolean{

    if(this.data.type=="PERSONNEL" && (!this.personnel || typeof this.personnel == "string") && this.addAllOtherPersonnel==false ){
      return true;
    }
    if(this.data.type=="CRITERE"){
      let different = false
      for(let key in this.criteres_object){
        let keyCritere : keyof typeof CRITERE_OBJECT = key as any;
        if(this.criteres_object[keyCritere]!=this.initial_critere_object[keyCritere]){
          different=true;
          break
        }
      }
      if(!different){
        return true;
      }
    }

    return false
  }

  envoiePersonnel(){
    if(this.data.type=="PERSONNEL" && this.addAllOtherPersonnel==true){
      return true;
    }
    return this.personnel;
  }
}
