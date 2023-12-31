import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { IPersonnel } from '../interfaces/ipersonnel';
import { TypePersonnel } from '../utils/types-map';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router)
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      let obser =  this.api.getAllData<TypePersonnel[]>({ for: "personnels" }).pipe(map((sub)=>{
        
        if(sub){
          let person = sub[this.auth.DEFAULT_PERSON];
          this.auth.login(person);
          console.log("Deuxième authentification ", person)
        }
        if(!this.auth.isAuthenticated && !this.auth.user){
          this.router.navigateByUrl("home");
        }else{
          if(this.auth.rolesName.includes("VOIR PAGE ADMINISTRATEUR")){
            this.router.navigateByUrl("gestion/collecte")
            return false
          }else{
            return true
          }
        }
        return false;
      }))

      return obser;
  }
  
}
