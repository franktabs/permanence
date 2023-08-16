import { Injectable } from '@angular/core';
import { IPersonnel } from '../interfaces/ipersonnel';
import { Subject } from 'rxjs';
import { TypePersonnel } from '../utils/types-map';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //admin:17
  public readonly DEFAULT_PERSON:number = 15;

  private _user:TypePersonnel|null=null;

  private _isAuthenticated:boolean = false;

  public isConnected$:Subject<boolean> = new Subject()


  login(user:TypePersonnel) {
    this._user = user;
    this._isAuthenticated = true;
    this.isConnected$.next(true);
  }

  logout() {
    this._user = null;
    this._isAuthenticated = false;
    this.isConnected$.next(false)
  }

  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  get user(){
    return this._user
  }

}
