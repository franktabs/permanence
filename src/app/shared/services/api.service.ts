import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPersonnel } from '../interfaces/ipersonnel';
import { Observable, Subject, catchError, tap, throwError } from 'rxjs';
import { Personnel } from '../models/personnel.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public readonly URL_PERSONNEL = "api/personnel.json";

  public personnels$:Subject<IPersonnel[]>= new Subject();

  constructor(private http:HttpClient) { }

  public getAllPersonnel():Observable<IPersonnel[]>{
    return this.http.get<IPersonnel>(this.URL_PERSONNEL).pipe(
      tap((values)=>console.log("données recupéré", values))
      ,catchError((err:HttpErrorResponse):Observable<any> =>{
        if(err.error instanceof ErrorEvent){
          console.error(err.error.message);
        }else{
          console.error(err.status);
        }
        return throwError(()=>new Error("Erreur produit au getAllPersonnel"));
      })
    )
  }
}
