import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { IPersonnel } from '../interfaces/ipersonnel';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router)
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let obser =  this.api.getAllData<IPersonnel[]>({ for: "personnels" }).pipe(map((sub)=>{
        let person = sub[this.auth.DEFAULT_PERSON];
        this.auth.login(person);
        if(!this.auth.isAuthenticated && !this.auth.user){
          this.router.navigateByUrl("home");
        }else{
          if(this.auth.user?.admin || this.auth.user?.superviseur){
            return true
          }else{
            this.router.navigateByUrl("user")
            return false
          }
        }
        return false;
      }))

      return obser;
  }
  
}
