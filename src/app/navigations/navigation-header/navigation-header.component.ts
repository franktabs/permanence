import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation-header.component.html',
  styleUrls: ['./navigation-header.component.scss']
})
export class NavigationHeaderComponent implements OnInit {

  public isConnected!:boolean;
  constructor(private auth:AuthService) { }

  ngOnInit(): void {
    this.isConnected = this.auth.isAuthenticated
  }

}
