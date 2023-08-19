import { Injectable } from '@angular/core';
import { IPersonnel } from '../interfaces/ipersonnel';
import { Subject } from 'rxjs';
import { TypePersonnel } from '../utils/types-map';
import { IRole } from '../interfaces/irole';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //admin:17
  public readonly DEFAULT_PERSON:number = 0;

  private _user:TypePersonnel|null=null;

  private _isAuthenticated:boolean = false;

  public isConnected$:Subject<boolean> = new Subject()

  public rolesName:IRole["name"][] = []


  login(user:TypePersonnel) {
    this._user = user;
    let roles = user.roles;
    if(roles){
      this.rolesName = roles.map((role)=>role.name)
    }
    this._isAuthenticated = true;
    this.isConnected$.next(true);
    console.log("personne connecté", this.user)
  }

  logout() {
    this._user = null;
    this._isAuthenticated = false;
    this.isConnected$.next(false);
    this.rolesName = [];
  }

  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  get user(){
    return this._user
  }

}
