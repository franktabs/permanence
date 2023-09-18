import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import IGroupe from '../../interfaces/igroupe';
import { MatDialog } from '@angular/material/dialog';
import { DataModalInput, ModalInputComponent } from '../modal-input/modal-input.component';
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
  

  constructor(
    private diallog:MatDialog

  ) { }


  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  ngOnInit(): void {

  }

  ajoutPerson(){
    let diallogRef = this.diallog.open<ModalInputComponent, DataModalInput>(ModalInputComponent, {data:{title:"Ajout Personnel", model:undefined, type:"personnel"}});
    diallogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe((subs)=>{
      if(!(!subs || typeof subs == "string")){
        let personnel:IApiPersonnel = subs;
        this.groupe.personnels.push(personnel);
      }
    })
  }

  deletePerson(index:number){
    this.groupe.personnels.splice(index,1);
  }

}
