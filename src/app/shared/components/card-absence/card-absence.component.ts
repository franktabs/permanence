import { Component, Input, OnInit } from '@angular/core';
import { IAbsence } from '../../interfaces/iabsence';
import { AuthService } from '../../services/auth.service';
import { IPersonnel } from '../../interfaces/ipersonnel';
import { TypeAbsence, TypePersonnel } from '../../utils/types-map';
import { IApiRemplacement } from '../../interfaces/iapiremplacement';
import { IRole, RoleType } from '../../interfaces/irole';

@Component({
  selector: 'app-card-absence',
  templateUrl: './card-absence.component.html',
  styleUrls: ['./card-absence.component.scss']
})
export class CardAbsenceComponent implements OnInit {

  @Input() absence!:IApiRemplacement

  public userAuth!:TypePersonnel|null;

  public authRoles:RoleType[]=[];

  constructor(private auth:AuthService) { }

  ngOnInit(): void {
    this.userAuth = this.auth.user;
    this.authRoles = this.auth.rolesName;
  }



}
