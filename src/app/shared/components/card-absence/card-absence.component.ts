import { Component, Input, OnInit } from '@angular/core';
import { IAbsence } from '../../interfaces/iabsence';
import { AuthService } from '../../services/auth.service';
import { IPersonnel } from '../../interfaces/ipersonnel';
import { TypeAbsence, TypePersonnel } from '../../utils/types-map';
import { IApiAbsence } from '../../interfaces/iapiabsence';

@Component({
  selector: 'app-card-absence',
  templateUrl: './card-absence.component.html',
  styleUrls: ['./card-absence.component.scss']
})
export class CardAbsenceComponent implements OnInit {

  @Input() absence!:IApiAbsence

  public userAuth!:TypePersonnel|null;
  constructor(private auth:AuthService) { }

  ngOnInit(): void {
    this.userAuth = this.auth.user;
  }

}
