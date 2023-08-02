import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
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
  private router = inject(Router)

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let obser =  this.api.getAllData<IPersonnel[]>({ for: "personnels" }).pipe(map((sub)=>{
      let person = sub[6];
      this.auth.login(person);
      if(!this.auth.isAuthenticated){
        this.router.navigateByUrl("home")
      }
      return this.auth.isAuthenticated;
    }))


    return obser
  }

}
