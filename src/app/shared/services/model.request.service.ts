import { Injectable } from '@angular/core';
import PersonnelRequest from '../models/model-request/PersonnelRequest';
import { IApiPersonnel } from '../interfaces/iapipersonnel';

@Injectable({
  providedIn: 'root'
})
export class ModelRequestService {

  public personnelListRequest:PersonnelRequest<IApiPersonnel[]> = new PersonnelRequest([]);

  constructor() { }
}
