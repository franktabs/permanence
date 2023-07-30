import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPersonnel } from '../interfaces/ipersonnel';
import { Observable, Subject, catchError, tap, throwError } from 'rxjs';
import { Personnel } from '../models/personnel.model';
import { IAbsence } from '../interfaces/iabsence';
import { IHolidays } from '../interfaces/iholidays';
import { IDirection } from '../interfaces/idirection';


export interface TypeApi {
  for: "holidays" | "directions" | "personnels" | "absences"
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public readonly URL_PERSONNELS = "api/personnels.json";
  public readonly URL_ABSENCES = "api/absences.json";
  public readonly URL_HOLIDAYS = "api/holidays.json";
  public readonly URL_DIRECTIONS = "api/directions.json";

  public personnels$: Subject<IPersonnel[]> = new Subject();
  public absences$: Subject<IAbsence[]> = new Subject();
  public holidays$: Subject<IHolidays[]> = new Subject();
  public directions$: Subject<IDirection[]> = new Subject();

  constructor(private http: HttpClient) { }

  public getAllData<T>(props: TypeApi): Observable<T> {
    let lien: string | null = null;
    if (props.for === "absences") {
      lien = this.URL_ABSENCES
    } else if (props.for === "directions") {
      lien = this.URL_DIRECTIONS
    } else if (props.for === "holidays") {
      lien = this.URL_HOLIDAYS
    } else if (props.for === "personnels") {
      lien = this.URL_PERSONNELS
    }
    if (lien) {
      return this.http.get<T>(lien).pipe(
        tap((values) => console.log("données recupéré ", lien, values))
        , catchError((err: HttpErrorResponse): Observable<any> => {
          if (err.error instanceof ErrorEvent) {
            console.error(err.error.message);
          } else {
            console.error(err.status);
          }
          return throwError(() => new Error("Erreur produit au chargement de données"));
        })
      )
    } else {
      return throwError(() => new Error("Erreur chargement url api !!!"));
    }

  }





}
