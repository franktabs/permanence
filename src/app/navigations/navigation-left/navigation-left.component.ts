import { Component, OnInit } from '@angular/core';
import { IPersonnel } from 'src/app/shared/interfaces/ipersonnel';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-navigation-left',
  templateUrl: './navigation-left.component.html',
  styleUrls: ['./navigation-left.component.scss']
})
export class NavigationLeftComponent implements OnInit {

  public userAuth!:IPersonnel|null;

  constructor(private auth:AuthService) { }

  ngOnInit(): void {
    this.userAuth = this.auth.user
  }

}
