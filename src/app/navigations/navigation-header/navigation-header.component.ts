import { Component, OnInit } from '@angular/core';
import { IAnnonce } from 'src/app/shared/interfaces/iannonce';
import { IApiPersonnel } from 'src/app/shared/interfaces/iapipersonnel';
import { INotification } from 'src/app/shared/interfaces/inotification';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OptionalKey } from 'src/app/shared/utils/type';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation-header.component.html',
  styleUrls: ['./navigation-header.component.scss']
})
export class NavigationHeaderComponent implements OnInit {

  public isConnected!:boolean;
  public userAuth:IApiPersonnel|null=null;
  public notifications!:INotification[]|undefined;


  public openModal: boolean = false;

  constructor(private auth:AuthService) { }

  ngOnInit(): void {
    this.isConnected = this.auth.isAuthenticated
    this.userAuth = this.auth.user;
    let tabNotifications = this.auth.user?.notifications;
    tabNotifications?.sort((notif1, notif2) => {
      if (notif2.annonce.submissionDate) {
        return notif2.annonce.submissionDate.localeCompare(
          notif1.annonce.submissionDate || ''
        );
      } else return 0;
    });
    this.notifications = tabNotifications?.slice(0, 5);

  }

  enleve_menu(){
    let nav = document.getElementById("div-nav")
    nav?.classList.toggle("not-visible");

    let page = document.querySelector(".page");
    if(nav?.classList.contains("not-visible")){
      page?.classList.add("add")
    }else{
      page?.classList.remove("add");
    }
  }

  handleClick(){
    this.openModal = true;
  }


  getNameEmetteur(annonce:OptionalKey<IAnnonce>){
    return annonce.emetteur?.firstname
  }


}


