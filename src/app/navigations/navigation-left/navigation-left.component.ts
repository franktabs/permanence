import { Component, OnInit } from '@angular/core';
import { IPersonnel } from 'src/app/shared/interfaces/ipersonnel';
import { IRole, RoleType } from 'src/app/shared/interfaces/irole';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TypePersonnel } from 'src/app/shared/utils/types-map';

@Component({
  selector: 'app-navigation-left',
  templateUrl: './navigation-left.component.html',
  styleUrls: ['./navigation-left.component.scss']
})
export class NavigationLeftComponent implements OnInit {

  public userAuth!:TypePersonnel|null;

  public authRoles!:RoleType[];

  constructor(private auth:AuthService) { }

  ngOnInit(): void {
    this.userAuth = this.auth.user;
    this.authRoles = this.auth.rolesName;
  }

}
