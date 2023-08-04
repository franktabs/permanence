import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { IAbsence } from '../../interfaces/iabsence';
import { IPersonnel } from '../../interfaces/ipersonnel';
import { TypeAbsence, TypePersonnel } from '../../utils/types-map';

//Tous les absences d'un utlisateur
@Component({
  selector: 'app-modal3',
  templateUrl: './modal3.component.html',
  styleUrls: ['./modal3.component.scss']
})
export class Modal3Component implements OnInit, OnChanges {

  @Input() close: boolean = true;
  @Output() closeChange: EventEmitter<boolean> = new EventEmitter();

  @Input() tabs: TypeAbsence | null = null;

  public tabAbsences: TypeAbsence[] | null = [];

  public user!:TypePersonnel;

  constructor(private userAuth: AuthService) { }

  ngOnInit(): void {
    if (this.userAuth.user && this.userAuth.user.absences) {
      this.tabAbsences = this.userAuth.user.absences as TypeAbsence[];
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
