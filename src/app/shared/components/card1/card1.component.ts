import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LoaderService } from '../../services/loader.service';


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
export class Card1Component implements OnInit {

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
  constructor(private loader:LoaderService) { }

  @Output() public theIcon:EventEmitter<OuputTypeCard1> = new EventEmitter<OuputTypeCard1>() ;


  public handleClick(){
    let varIcon = this.icon;
    let varTitle = this.title;
    this.theIcon.emit({icon:varIcon, title:varTitle});
  }

  ngOnInit(): void {
  }

  public handleAdd(titre:TitleCard1){
    this.toAdd.emit(titre);
  }

}
