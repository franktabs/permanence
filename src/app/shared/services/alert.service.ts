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

  alertFormulaire(){
    this.alertMaterial(
      { message: 'Veuillez renseignez tous les champs', title: 'error' },
      2
    );
    setTimeout(()=>{
      this.alertMaterial({message:"Selectionner les personnes de la liste deroulante pour chaque entrées", title:"information"}, 5)
    }, 2100)
  }
}
