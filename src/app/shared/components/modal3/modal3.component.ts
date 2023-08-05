import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { IAbsence } from '../../interfaces/iabsence';
import { IPersonnel } from '../../interfaces/ipersonnel';
import { TypeAbsence, TypePersonnel } from '../../utils/types-map';
import { IApiAbsence } from '../../interfaces/iapiabsence';

//Tous les absences d'un utlisateur
@Component({
  selector: 'app-modal3',
  templateUrl: './modal3.component.html',
  styleUrls: ['./modal3.component.scss']
})
export class Modal3Component implements OnInit, OnChanges {

  @Input() close: boolean = true;
  @Output() closeChange: EventEmitter<boolean> = new EventEmitter();

  @Input() tabs: IApiAbsence[] | null = null;

  public _tabAbsences: IApiAbsence[] | null = [];

  public user!:TypePersonnel;

  constructor(private userAuth: AuthService) { }

  set tabAbsences(value:IApiAbsence[]|null){
    this._tabAbsences = value
  }

  get tabAbsences(){
    return this._tabAbsences
  }

  ngOnInit(): void {

      if (this.userAuth.user && this.userAuth.user.absences && this.userAuth.user.agent) {
        this.tabAbsences = this.userAuth.user.absences as TypeAbsence[];
      }
      if(this.userAuth.user){
        this.user=this.userAuth.user;
      }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["tabs"]) {
      this.tabAbsences = changes["tabs"].currentValue;
      console.log("tableau envoyé", this.tabAbsences)
    }
  }

  up() {
    this.closeChange.emit(true)
  }

}
