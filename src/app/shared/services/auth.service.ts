import { Injectable } from '@angular/core';
import { IPersonnel } from '../interfaces/ipersonnel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user:IPersonnel|null=null;

  private _isAuthenticated:boolean = false;

  login(user:IPersonnel) {
    this._user = user;
    this.isAuthenticated = true;
  }

  logout() {
    this._user = null;
    this.isAuthenticated = false;
  }

  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  set isAuthenticated(value:boolean){
    this._isAuthenticated = value;
  }

  get user(){
    return this._user
  }
}
