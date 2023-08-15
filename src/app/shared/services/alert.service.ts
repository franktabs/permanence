import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AlertMaterialComponent } from '../components/alert-material/alert-material.component';

export type AlertMessage = {
  title:"error"|"success"|"information",
  message:string
}

@Injectable({
  providedIn: 'root',
})
export class AlertService {

  public message:AlertMessage = {title:"information", message:""};

  constructor(private snackbar: MatSnackBar) {
  }

  alertMaterial(message:AlertMessage, duration:number = 2){
    this.message = message;
    this.snackbar.openFromComponent(AlertMaterialComponent, {
      duration: duration*1000,
      data:message
    })
  }
}
