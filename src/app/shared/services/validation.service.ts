import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() { }


  // emailUnique(control:AbstractControl) : ValidationErrors|null {
  //   const value = control.value;
  //   console.log("api dans validation", this.api)
  //   let personnels = this.api.data.personnels;
  //   let emailList = personnels.map((personnel)=>{
  //     personnel.emailaddress;
  //   })
  //   if(emailList.includes(value)){
  //     return {"emailUnique":true}
  //   }

  //   return null;
  // }
}
