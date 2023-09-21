import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, Subject, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { LoaderService } from '../services/loader.service';
import { AlertService } from '../services/alert.service';
import { IApiPersonnel } from '../interfaces/iapipersonnel';
import axios from 'axios';
import { dataOrganisation, dataParameter, dataPersonne, dataRole } from './admin.guard';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

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

    let user:any = localStorage.getItem("user");
    if(user!=null){
      user = JSON.parse(user);
      this.auth.login(user);
    }
    let isRefresh:any = localStorage.getItem("isRefresh");
    if(isRefresh!=null ){
      isRefresh = JSON.parse(isRefresh);
      if(isRefresh==true){
        this.api.blockInitGuard=true;
      }else{
        this.api.blockInitGuard=false;
      }
    }
    this.initDB();

    return this.continueInUrl();

  }


  async initDB() {
    console.log('execution de initDB');

    if(this.api.blockInitGuard==false){
      this.api.blockInitGuard = true;
      try {
        let response = await axios.get(this.api.URL_ROLES);
        console.log('data initDB', response.data);
        if (response.data == false) {
          console.log('creation de la db de initDB');
          this.alert.alertMaterial(
            { message: 'Initialisation des informations', title: 'information' },
            10
          );
          this.loader.loader_modal$.next(false);
          response = await axios.post(this.api.URL_ROLES + '/many', dataRole);
          console.log(response.data);
          response = await axios.post(
            this.api.URL_PARAMETERS + '/many',
            dataParameter
          );
          console.log(response.data);
          response = await axios.post(
            this.api.URL_DIRECTIONS + '/config-actualise',
            dataOrganisation
          );
          console.log(response.data);
  
          response = await axios.post(
            this.api.URL_PERSONNELS + '/config-actualise',
            dataPersonne
          );
          console.log(response.data);
  
          response = await axios.put(this.api.URL_ROLES + '/giveAll/0');
          console.log(response.data);
  
          location.reload();
        } else {
          console.log('Non creation des datas DB');
          if(this.auth.isAuthenticated==false){
  
            response = await axios.get(this.api.URL_PERSONNELS + '/userId/' + this.auth.DEFAULT_PERSON);
            if(response.data){
              // this.auth.login(response.data);
              localStorage.setItem("user", JSON.stringify(response.data));
              localStorage.setItem("isRefresh", JSON.stringify(true));
              this.router.navigateByUrl("gestion/collecte")

              // location.reload();
            }
          }
        }
      } catch (e) {
        console.error("voici l'erreur de initDB => ", e);
  
        this.alert.alertMaterial(
          { message: 'Impossible de Joindre le Backend', title: 'error' },
          10
        );
        try {
          let response = await axios.get('api/admin.json');
          if (response.data && this.auth.isAuthenticated == false) {
            localStorage.setItem("user", JSON.stringify(response.data));
            localStorage.setItem("isRefresh", JSON.stringify(true));
            this.auth.login(response.data);
            this.router.navigateByUrl('gestion/collecte');
          }
        } catch (e) {
          console.error("Voici l'erreur ", e);
          this.alert.alertError();
        }
      }
      this.api.blockInitGuard = false;
    }

  }

  continueInUrl(): boolean {
    if (
      (!this.auth.isAuthenticated && !this.auth.user) ||
      !this.auth.rolesName.includes('SE CONNECTER')
    ) {
      this.loader.loader_modal$.next(false);
      return true;
    } else {
      if (
        this.auth.rolesName.includes('VOIR PAGE ADMINISTRATEUR') &&
        this.auth.rolesName.includes('SE CONNECTER')
      ) {
        this.loader.loader_modal$.next(false);
        this.router.navigateByUrl('gestion/collecte');
        return false;
      } else {
        this.loader.loader_modal$.next(false);
        this.router.navigateByUrl('user');
        return false;
      }
    }
  }

  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

  //   if(!this.auth.isAuthenticated || !this.auth.rolesName.includes("SE CONNECTER") ){
  //     this.router.navigateByUrl("home")
  //     return false;
  //   }
  //   return true
  // }

}
