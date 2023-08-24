import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, map } from 'rxjs';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { IPersonnel } from '../interfaces/ipersonnel';
import { TypePersonnel } from '../utils/types-map';
import { IApiPersonnel } from '../interfaces/iapipersonnel';
import { formatJSON, mapJSON } from '../utils/function';
import { mapPersonnel } from '../utils/tables-map';
import { LoaderService } from '../services/loader.service';
import { AlertService } from '../services/alert.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private loader = inject(LoaderService);
  private alert = inject(AlertService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.loader.loader_modal$.next(true);
    let obser = this.api
      .getAllData<IApiPersonnel>(
        { for: 'void' },
        this.api.URL_PERSONNELS + '/userId/' + this.auth.DEFAULT_PERSON
      )
      .pipe(
        map((sub) => {
          // let subTransform:TypePersonnel[] = mapJSON<IApiPersonnel, IPersonnel>(sub, mapPersonnel)
          if (sub) {
            let person: TypePersonnel = sub;
            this.auth.login(person);
            if (
              (!this.auth.isAuthenticated && !this.auth.user) ||
              !this.auth.rolesName.includes('SE CONNECTER')
            ) {
              this.router.navigateByUrl('home');
            } else {
              if (
                this.auth.rolesName.includes('VOIR PAGE ADMINISTRATEUR') &&
                this.auth.rolesName.includes('SE CONNECTER')
              ) {
                this.loader.loader_modal$.next(false);

                return true;
              } else {
                this.loader.loader_modal$.next(false);
                this.router.navigateByUrl('user');
                return false;
              }
            }
          }else{
            this.alert.alertMaterial({"message":"Erreur connexion", title:"error"}, 7)
          }

          this.loader.loader_modal$.next(false);
          
          return false;
        })
      );

    return obser;
  }
}
