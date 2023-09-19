import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { ApiService } from '../../services/api.service';
import { IApiPersonnel } from '../../interfaces/iapipersonnel';
import { Subject, takeUntil } from 'rxjs';


export type OuputTypeCard1 = {
  icon:string;
  title:TitleCard1;
}

export type TitleCard1 = "Absences"|"Personnel"|"Remplacement"|""|"Departement"|"Direction";

//Carte affiché à l'admin ou superviseur: Congé, Personnel, Absences

@Component({
  selector: 'app-card1',
  templateUrl: './card1.component.html',
  styleUrls: ['./card1.component.scss']
})
export class Card1Component implements OnInit, OnDestroy {


  @Input()
  public title!:"Absences"|"Personnel"|"Remplacement";

  @Input()
  public icon!:string;

  @Input()
  public iconAdd!:string;

  @Output()
  public toAdd:EventEmitter<TitleCard1> = new EventEmitter();

  @Input()
  public date1!:Date;

  @Input()
  public date2!:Date;

  public destroy$:Subject<boolean> = new Subject();

  public personnels!:IApiPersonnel[];
  constructor(private loader:LoaderService, private api:ApiService) { }


  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  @Output() public theIcon:EventEmitter<OuputTypeCard1> = new EventEmitter<OuputTypeCard1>() ;


  public handleClick(){
    let varIcon = this.icon;
    let varTitle = this.title;
    this.theIcon.emit({icon:varIcon, title:varTitle});
  }

  ngOnInit(): void {
    this.personnels = this.api.data.personnels;
    this.api.personnels$.pipe(takeUntil(this.destroy$)).subscribe((subs)=>{
      this.personnels = subs;
    })
  }

  public handleAdd(titre:TitleCard1){
    this.toAdd.emit(titre);
  }

}
