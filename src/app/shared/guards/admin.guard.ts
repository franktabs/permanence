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
import axios from 'axios';

export const dataRole = [
  {
    name: 'AJOUTER UNE ABSENCE',
    personnels: [],
  },
  {
    name: 'ATTRIBUER LES ROLES',
    personnels: [],
  },
  {
    name: 'MODIFIER PLANNING',
    personnels: [],
  },
  {
    name: 'SE CONNECTER',
    personnels: [],
  },
  {
    name: 'VALIDER PLANNING',
    personnels: [],
  },
  {
    name: 'VALIDER REMPLACEMENT',
    personnels: [],
  },
  {
    name: 'VOIR PAGE ADMINISTRATEUR',
    personnels: [],
  },
];

export const dataParameter = [
  {
    code: 'api1_DSI',
    libelle: 'API PERSONNEL',
  },
  {
    code: 'api2_DSI',
    libelle: 'API DIRECTION',
  },
];

export const dataOrganisation = [
  {
    loginDA: '',
    ville: '',
    code: '',
    level: '4',
    parentorganizationId: '287662',
    description: '',
    nomDA: '',
    userName: 'Test Test',
    userId: '20130',
    organizationId: '287702',
    companyId: '20101',
    phone: '',
    typeAgence: 'Aucun',
    modifiedDate: '2021-09-26 12:58:10.174',
    name: 'REGION CENTRE',
    adresse: '',
    codeSWIFT: '',
    treePath: '/287662/287702/',
    type_: 'REGION',
    email: '',
    createDate: '2021-09-26 12:58:10.174',
  },
  {
    loginDA: '',
    ville: '',
    code: '',
    level: '1',
    parentorganizationId: '287810',
    description: '',
    nomDA: '',
    userName: 'Test Test',
    userId: '20130',
    organizationId: '287829',
    companyId: '20101',
    phone: '',
    typeAgence: 'Aucun',
    modifiedDate: '2023-01-17 07:50:11.983',
    name: 'DIVISION GESTIONNAIRE PARTICULIER HIPPODROME',
    adresse: '',
    codeSWIFT: '',
    treePath: '/287662/287702/287778/287810/287829/',
    type_: 'DIVISION',
    email: '',
    createDate: '2021-09-26 13:16:22.041',
  },
  {
    loginDA: '',
    ville: '',
    code: '',
    level: '2',
    parentorganizationId: '287702',
    description: '',
    nomDA: '',
    userName: 'Test Test',
    userId: '20130',
    organizationId: '287759',
    companyId: '20101',
    phone: '',
    typeAgence: 'Aucun',
    modifiedDate: '2021-09-26 13:08:48.404',
    name: 'AGENCE MESSA',
    adresse: '',
    codeSWIFT: '',
    treePath: '/287662/287702/287759/',
    type_: 'AGENCE',
    email: '',
    createDate: '2021-09-26 13:07:38.971',
  },
  {
    loginDA: '',
    ville: '',
    code: '',
    level: '1',
    parentorganizationId: '470291',
    description: '',
    nomDA: '',
    userName: 'Test Test',
    userId: '20130',
    organizationId: '470349',
    companyId: '20101',
    phone: '',
    typeAgence: 'Aucun',
    modifiedDate: '2023-01-24 19:59:38.269',
    name: 'DIVISION GESTIONNAIRE RETAIL BONANJO',
    adresse: '',
    codeSWIFT: '',
    treePath: '/287662/470310/470291/470349/',
    type_: 'DIVISION',
    email: '',
    createDate: '2023-01-24 08:57:14.574',
  },
  {
    loginDA: '',
    ville: '',
    code: '',
    level: '2',
    parentorganizationId: '287778',
    description: '',
    nomDA: '',
    userName: 'Test Test',
    userId: '20130',
    organizationId: '287810',
    companyId: '20101',
    phone: '',
    typeAgence: 'Aucun',
    modifiedDate: '2023-01-16 13:48:21.775',
    name: 'DEPARTEMENT CORPORATE HIPPODROME',
    adresse: '',
    codeSWIFT: '',
    treePath: '/287662/287702/287778/287810/',
    type_: 'DEPARTEMENT',
    email: '',
    createDate: '2021-09-26 13:15:18.127',
  },
  {
    loginDA: '',
    ville: '',
    code: '',
    level: '3',
    parentorganizationId: '287702',
    description: '',
    nomDA: '',
    userName: 'Test Test',
    userId: '20130',
    organizationId: '287778',
    companyId: '20101',
    phone: '',
    typeAgence: 'Aucun',
    modifiedDate: '2023-01-16 13:48:39.819',
    name: 'SUCCURSALE HIPPODROME',
    adresse: '',
    codeSWIFT: '',
    treePath: '/287662/287702/287778/',
    type_: 'AGENCE',
    email: '',
    createDate: '2021-09-26 13:11:00.195',
  },
  {
    loginDA: '',
    ville: '',
    code: '',
    level: '4',
    parentorganizationId: '287662',
    description: '',
    nomDA: '',
    userName: 'Test Test',
    userId: '20130',
    organizationId: '287721',
    companyId: '20101',
    typeAgence: 'Aucun',
    phone: '01600',
    modifiedDate: '2023-01-16 15:04:00.117',
    name: 'DIRECTION DES SYSTEMES INFORMATIONS',
    adresse: '',
    codeSWIFT: '',
    treePath: '/287662/287721/',
    type_: 'DIRECTION',
    email: '',
    createDate: '2021-09-26 13:03:04.366',
  },
  {
    loginDA: '',
    ville: '',
    code: '',
    level: '2',
    parentorganizationId: '287721',
    description: '',
    nomDA: '',
    userName: 'Test Test',
    userId: '20130',
    organizationId: '287740',
    companyId: '20101',
    phone: '',
    typeAgence: 'Aucun',
    modifiedDate: '2021-09-26 13:05:55.172',
    name: 'DEPARTEMENT DEVELOPPEMENT ET INTEGRATION DES LOGICIELS',
    adresse: '',
    codeSWIFT: '',
    treePath: '/287662/287721/287740/',
    type_: 'DEPARTEMENT',
    email: '',
    createDate: '2021-09-26 13:05:55.172',
  },
  {
    loginDA: '',
    ville: '',
    code: '',
    level: '3',
    parentorganizationId: '470310',
    description: '',
    nomDA: '',
    userName: 'Test Test',
    userId: '20130',
    organizationId: '470291',
    companyId: '20101',
    phone: '',
    typeAgence: 'Aucun',
    modifiedDate: '2023-01-24 08:54:01.391',
    name: 'SUCCURSALE BONANJO',
    adresse: '',
    codeSWIFT: '',
    treePath: '/287662/470310/470291/',
    type_: 'AGENCE',
    email: '',
    createDate: '2023-01-24 08:49:15.674',
  },
  {
    loginDA: '',
    ville: '',
    code: '',
    level: '2',
    parentorganizationId: '470291',
    description: '',
    nomDA: '',
    userName: 'Test Test',
    userId: '20130',
    organizationId: '470330',
    companyId: '20101',
    phone: '',
    typeAgence: 'Aucun',
    modifiedDate: '2023-01-24 08:55:57.834',
    name: 'DEPARTEMENT CORPORATE BONANJO',
    adresse: '',
    codeSWIFT: '',
    treePath: '/287662/470310/470291/470330/',
    type_: 'DEPARTEMENT',
    email: '',
    createDate: '2023-01-24 08:55:57.834',
  },
  {
    loginDA: '',
    ville: '',
    code: '',
    level: '1',
    parentorganizationId: '0',
    description: '',
    nomDA: '',
    userName: '',
    userId: '20105',
    organizationId: '70410',
    companyId: '20101',
    phone: '',
    typeAgence: 'Aucun',
    modifiedDate: '2023-01-16 15:57:11.102',
    name: 'CAMEROUN',
    adresse: '',
    codeSWIFT: '',
    treePath: '/70410/',
    type_: 'pays',
    email: '',
    createDate: '2021-05-19 15:31:03.74',
  },
  {
    loginDA: '',
    ville: '',
    code: '',
    level: '1',
    parentorganizationId: '470330',
    description: '',
    nomDA: '',
    userName: 'Test Test',
    userId: '20130',
    organizationId: '470696',
    companyId: '20101',
    phone: '',
    typeAgence: 'Aucun',
    modifiedDate: '2023-01-24 19:58:13.661',
    name: 'DIVISION GESTIONNAIRE PME BONANJO',
    adresse: '',
    codeSWIFT: '',
    treePath: '/287662/470310/470291/470330/470696/',
    type_: 'DIVISION',
    email: '',
    createDate: '2023-01-24 19:57:14.796',
  },
  {
    loginDA: '',
    ville: '',
    code: '',
    level: '1',
    parentorganizationId: '470330',
    description: '',
    nomDA: '',
    userName: 'Test Test',
    userId: '20130',
    organizationId: '470677',
    companyId: '20101',
    phone: '',
    typeAgence: 'Aucun',
    modifiedDate: '2023-01-24 19:58:58.811',
    name: 'DIVISION GESTIONNAIRE GE BONANJO',
    adresse: '',
    codeSWIFT: '',
    treePath: '/287662/470310/470291/470330/470677/',
    type_: 'DIVISION',
    email: '',
    createDate: '2023-01-24 19:56:53.213',
  },
  {
    loginDA: '',
    ville: '',
    code: '',
    level: '2',
    parentorganizationId: '287721',
    description: '',
    nomDA: '',
    userName: 'Test Test',
    userId: '20130',
    organizationId: '287742',
    companyId: '20101',
    phone: '',
    typeAgence: 'Aucun',
    modifiedDate: '2021-09-26 13:05:55.172',
    name: 'production et de la plateforme collaborative',
    adresse: '',
    codeSWIFT: '',
    treePath: '/287662/287721/287740/',
    type_: 'DEPARTEMENT',
    email: '',
    createDate: '2021-09-26 13:05:55.172',
  },
];

export const dataPersonne = [
  {
    id: 1,
    firstname: 'admin',
    emailaddress: 'admin@afrilandfirstbank.com',
    telephoneCisco: '01644',
    telephoneMobile: '673498292',
    userId: 0,
    sexe: 'M',
    fonction: 'admin-0',
    service: 'INFORMATIQUE',
    libAge: 'AUCUN',
    organizationId: 287740,
    agent: true,
    screenname: null,
  },
];

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

    this.initDB();
    
    return this.continueInUrl()

  }

  async initDB() {
    console.log('execution de initDB');
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
            this.auth.login(response.data);
            this.router.navigateByUrl("gestion/collecte")
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
          this.auth.login(response.data);
          this.router.navigateByUrl('gestion/collecte');
        }
      } catch (e) {
        console.error("Voici l'erreur ", e);
        this.alert.alertError();
      }
    }
  }

  continueInUrl(): boolean  {
    if (
      (!this.auth.isAuthenticated && !this.auth.user) ||
      !this.auth.rolesName.includes('SE CONNECTER')
    ) {
      this.router.navigateByUrl('home');
      return false;
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
  }
}
