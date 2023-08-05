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
import { IApiAbsence } from '../interfaces/iapiabsence';

export interface TypeApi {
  for: 'holidays' | 'directions' | 'personnels' | 'absences';
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  public readonly IP = 'http://192.168.2.64:8080/gestion';
  // public readonly URL_PERSONNELS = this.IP+'/person/allPersons';
  public readonly URL_PERSONNELS = 'api/apiPersonnels.json';


  public readonly URL_ABSENCES = 'api/apiAbsences.json';
  public readonly URL_POST_ABSENCES= ""

  public readonly URL_HOLIDAYS = 'api/apiHolidays.json';


  // public readonly URL_DIRECTIONS = this.IP + '/direction/allDirections';
  public readonly URL_DIRECTIONS = 'api/apiDirections.json';


  constructor(private http: HttpClient) {}

  public postAbsence(absence: IApiAbsence): Observable<IApiAbsence> {
    return this.http
      .post(`${this.URL_POST_ABSENCES}`, absence)
      .pipe(catchError(this.displayError) as any);
  }

  public getAllData<T>(props: TypeApi): Observable<T> {
    let lien: string | null = null;
    if (props.for === 'absences') {
      lien = this.URL_ABSENCES;
    } else if (props.for === 'directions') {
      lien = this.URL_DIRECTIONS;
    } else if (props.for === 'holidays') {
      lien = this.URL_HOLIDAYS;
    } else if (props.for === 'personnels') {
      lien = this.URL_PERSONNELS;
    }
    if (lien) {
      return this.http.get<T>(lien).pipe(
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
            () => new Error('Erreur produit au chargement de données, '+lien)
          );
        })
      );
    } else {
      return throwError(() => new Error('Erreur chargement url api !!! '+lien));
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
