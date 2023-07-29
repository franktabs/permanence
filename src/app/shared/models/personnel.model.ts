import { IPersonnel } from "../interfaces/ipersonnel";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { IHolidays } from "../interfaces/iholidays";
import { IAbsence } from "../interfaces/iabsence";


export interface PropsPersonnel {
    data:IPersonnel;
    holiday:IHolidays;
    absence:IAbsence;
}

export class Personnel{

    constructor(public props:PropsPersonnel){}
    
}