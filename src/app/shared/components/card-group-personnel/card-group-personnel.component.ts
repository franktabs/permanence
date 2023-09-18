import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import IGroupe from '../../interfaces/igroupe';
import { MatDialog } from '@angular/material/dialog';
import { CRITERE_OBJECT, DataModalInput, ModalInputComponent } from '../modal-input/modal-input.component';
import { Subject, takeUntil } from 'rxjs';
import { IApiPersonnel } from '../../interfaces/iapipersonnel';

@Component({
  selector: 'app-card-group-personnel',
  templateUrl: './card-group-personnel.component.html',
  styleUrls: ['./card-group-personnel.component.scss']
})
export class CardGroupPersonnelComponent implements OnInit, OnDestroy {

  @Input()
  public groupe:IGroupe= {nom:"group", criteres:[], personnels:[]};

  public destroy$:Subject<boolean> = new Subject();

  public criteres_object:typeof CRITERE_OBJECT = CRITERE_OBJECT;
  

  constructor(
    private diallog:MatDialog

  ) { }


  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  ngOnInit(): void {

  }

  ajout(type:"PERSONNEL"|"CRITERE"){
    let diallogRef = this.diallog.open<ModalInputComponent, DataModalInput>(ModalInputComponent, {data:{title:type=="PERSONNEL"?"Ajout Personnel":"Choix Critères", model:undefined, type:type, critere_object:this.criteres_object}});
    diallogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((subs)=>{
      if( type == "PERSONNEL" && (!(!subs || typeof subs == "string"))){
        let personnel:IApiPersonnel = subs;
        this.groupe.personnels.unshift(personnel);
      }else if (type=="CRITERE" && subs){
       
        console.log("voici le subs de retour", subs);
        let criteres_object_modal: typeof CRITERE_OBJECT = subs
        this.criteres_object = criteres_object_modal;
        let criteresExist = this.groupe.criteres.map((obj)=> obj.nom);
        this.groupe.criteres = [];
        Object.keys(criteres_object_modal).forEach((value)=>{
          let keyCritere: keyof typeof CRITERE_OBJECT = value as any;
          if(this.criteres_object[keyCritere]==true){
            this.groupe.criteres.unshift({nom:keyCritere})
          }
        })
      }
    })
  }

  deletePerson(index:number){
    this.groupe.personnels.splice(index,1);
  }

  deleteCritere(index:number){
    this.criteres_object[this.groupe.criteres[index].nom] = false;
    this.groupe.criteres.splice(index, 1);
  }
}
