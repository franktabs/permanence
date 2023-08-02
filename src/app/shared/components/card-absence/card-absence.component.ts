import { Component, Input, OnInit } from '@angular/core';
import { IAbsence } from '../../interfaces/iabsence';
import { AuthService } from '../../services/auth.service';
import { IPersonnel } from '../../interfaces/ipersonnel';

@Component({
  selector: 'app-card-absence',
  templateUrl: './card-absence.component.html',
  styleUrls: ['./card-absence.component.scss']
})
export class CardAbsenceComponent implements OnInit {

  @Input() absence!:IAbsence

  public userAuth!:IPersonnel|null;
  constructor(private auth:AuthService) { }

  ngOnInit(): void {
    this.userAuth = this.auth.user;
  }

}
