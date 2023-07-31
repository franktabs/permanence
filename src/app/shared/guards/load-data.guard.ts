import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map, take, tap } from 'rxjs';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { IPersonnel } from '../interfaces/ipersonnel';

@Injectable({
  providedIn: 'root'
})
export class LoadDataGuard implements CanActivate {

  private api = inject(ApiService);
  private auth = inject(AuthService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let obser =  this.api.getAllData<IPersonnel[]>({ for: "personnels" }).pipe(map((sub)=>{
      let person = sub[6];
      this.auth.login(person);
      console.log("ecrit avant")
      return this.auth.isAuthenticated;
    }))


    return obser
  }

}
