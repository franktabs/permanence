import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPersonnel } from '../interfaces/ipersonnel';
import { Observable, Subject, catchError, tap, throwError } from 'rxjs';
import { Personnel } from '../models/personnel.model';
import { IAbsence } from '../interfaces/iabsence';
import { IHolidays } from '../interfaces/iholidays';
import { IDirection } from '../interfaces/idirection';
import { IApiDirection } from '../interfaces/iapidirection';
import { TypeAbsence } from '../utils/types-map';
import { IApiRemplacement } from '../interfaces/iapiremplacement';
import { IApiPersonnel } from '../interfaces/iapipersonnel';
import { IPlanning } from '../interfaces/iplanning';
import { IApiHoliday } from '../interfaces/iapiholiday';
import { IPermanence } from '../interfaces/ipermanence';

type DataApi = {
  personnels: IApiPersonnel[];
  absences: IApiHoliday[];
  plannings: IPlanning[];
  directions: IApiDirection[];
  permanences: IPermanence[];
};

export interface TypeApi {
  for:
    | 'holidays'
    | 'directions'
    | 'personnels'
    | 'absences'
    | 'plannings'
    | 'months'
    | 'permanences'
    | 'personnel_jour'
    | 'personnel_nuit'
    | 'void';
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public data: DataApi = {
    personnels: [],
    absences: [],
    plannings: [],
    directions: [],
    permanences: [],
  };
  public personnels$: Subject<IApiPersonnel[]> = new Subject();
  public absences$: Subject<IApiHoliday[]> = new Subject();
  public directions$: Subject<IApiDirection[]> = new Subject();
  public permanence$: Subject<IPermanence[]> = new Subject();
  public plannings$: Subject<IPlanning[]> = new Subject();
  // public readonly IP = 'http://192.168.2.64:8080/gestion';
  public readonly IP = 'http://localhost:8000/api';

  public readonly URL_PERSONNELS = this.IP + '/personnel';
  public readonly URL_ABSENCES = this.IP + '/absence';
  public readonly URL_PLANNINGS = this.IP + '/planning';
  public readonly URL_DIRECTIONS = this.IP + '/direction';
  public readonly URL_MONTHS = this.IP + '/month';
  public readonly URL_PERMANENCES = this.IP + '/permanence';
  public readonly URL_PERSONNEL_JOURS = this.IP + '/personnel_jour';
  public readonly URL_PERSONNEL_NUITS = this.IP + '/personnel_nuit';
  public readonly URL_HOLIDAYS = this.IP + '/absence';
  public readonly URL_REMPLACEMENTS = this.IP + '/remplacement';
  public readonly URL_ROLES = this.IP + '/role';
  public readonly URL_ANNONCES = this.IP + '/annonce';
  public readonly URL_NOTIFICATIONS = this.IP + '/notification';
  public readonly URL_PARAMETERS = this.IP + '/parameter';

  // public readonly URL_HOLIDAYS = 'api/apiHolidays.json';
  // public readonly URL_PERSONNELS = 'api/apiPersonnels.json';
  // public readonly URL_ABSENCES = 'api/apiAbsences.json';
  // public readonly URL_DIRECTIONS = 'api/apiDirections.json';
  // public readonly URL_PLANNINGS = 'api/plannings.json';

  // public readonly URL_PERSONNELS = this.IP+'/person/allPersons';
  // public readonly URL_POST_ABSENCES = this.IP + '/person/absence/create/';
  // public readonly URL_DIRECTIONS = this.IP + '/direction/allDirections';

  constructor(private http: HttpClient) {}

  public postData<T>(url: string, data: T): Observable<T> {
    return this.http.post(url, data).pipe(catchError(this.displayError) as any);
  }

  public getAllData<T>(
    props: TypeApi,
    url: string = ''
  ): Observable<T | undefined> {
    let lien: string | null = null;
    let obserb$: Subject<any> = new Subject();
    let key: keyof DataApi | null = null;

    if (props.for === 'absences') {
      lien = this.URL_ABSENCES;
    } else if (props.for === 'directions') {
      lien = this.URL_DIRECTIONS;
    } else if (props.for === 'holidays') {
      lien = this.URL_HOLIDAYS;
    } else if (props.for === 'personnels') {
      lien = this.URL_PERSONNELS;
      obserb$ = this.personnels$;
      key = 'personnels';
    } else if (props.for === 'plannings') {
      lien = this.URL_PLANNINGS;
    } else if (props.for === 'months') {
      lien = this.URL_MONTHS;
    } else if (props.for === 'permanences') {
      lien = this.URL_PERMANENCES;
    } else if (props.for === 'personnel_jour') {
      lien = this.URL_PERSONNEL_JOURS;
    } else if (props.for === 'personnel_nuit') {
      lien = this.URL_PERSONNEL_NUITS;
    } else if (props.for === 'void') {
      lien = url;
    }

    if (lien) {
      return this.http.get<T | undefined>(lien).pipe(
        tap((values) => {
          console.log('données recupéré ', lien, values);
          // let tabs = values as any
          // if(props.for==="directions"){
          //   for(let value of tabs){

          //     this.http.post(this.IP+"/direction/create", value).pipe(
          //       tap(elm=>console.log("insertion de ", elm)),
          //       catchError(this.displayError)
          //     ).subscribe((subs)=>{
          //       console.log("l'objet", subs,"sauvegardé")
          //     })
          //   }
          // }
        }),
        catchError((err: HttpErrorResponse): Observable<any> => {
          if (err.error instanceof ErrorEvent) {
            console.error("message d'erreur", err, "a l'url ", lien);
            console.error(err.error.message);
          } else {
            console.error(err.status);
          }
          return throwError(
            () => new Error('Erreur produit au chargement de données, ' + lien)
          );
        })
      );
    } else {
      return throwError(
        () => new Error('Erreur chargement url api !!! ' + lien)
      );
    }
  }

  displayError(err: HttpErrorResponse): Observable<any> {
    if (err.error instanceof ErrorEvent) {
      console.error(err.error.message);
    } else {
      console.error(err.status);
    }
    return throwError(
      () => new Error('Erreur produit au chargement de données')
    );
  }
}
