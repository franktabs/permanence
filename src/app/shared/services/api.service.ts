import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public readonly urlPersonnel = "api/personnel.json"

  constructor() { }
}
