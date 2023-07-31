import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { IAbsence } from '../../interfaces/iabsence';
import { IPersonnel } from '../../interfaces/ipersonnel';

//Tous les absences d'un utlisateur
@Component({
  selector: 'app-modal3',
  templateUrl: './modal3.component.html',
  styleUrls: ['./modal3.component.scss']
})
export class Modal3Component implements OnInit, OnChanges {

  @Input() close: boolean = true;
  @Output() closeChange: EventEmitter<boolean> = new EventEmitter();

  @Input() tabs: IAbsence | null = null;

  public tabAbsences: IAbsence[] | null = [];

  public user!:IPersonnel;

  constructor(private userAuth: AuthService) { }

  ngOnInit(): void {
    if (this.userAuth.user && this.userAuth.user.absences) {
      this.tabAbsences = this.userAuth.user.absences;
    }
    if(this.userAuth.user){
      this.user=this.userAuth.user;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["tabs"]) {
      this.tabAbsences = changes["tabs"].currentValue;
    }
  }

  up() {
    this.closeChange.emit(true)
  }

}
