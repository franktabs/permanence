import { Component, OnInit } from '@angular/core';
import { IPersonnel } from 'src/app/shared/interfaces/ipersonnel';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TypePersonnel } from 'src/app/shared/utils/types-map';

@Component({
  selector: 'app-navigation-left',
  templateUrl: './navigation-left.component.html',
  styleUrls: ['./navigation-left.component.scss']
})
export class NavigationLeftComponent implements OnInit {

  public userAuth!:TypePersonnel|null;

  constructor(private auth:AuthService) { }

  ngOnInit(): void {
    this.userAuth = this.auth.user;
    
  }

}
