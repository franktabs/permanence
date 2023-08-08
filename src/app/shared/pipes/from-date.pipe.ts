import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fromDate',
})
export class FromDatePipe implements PipeTransform {
  transform(value: Date | string, type:"jour"|"local"): string {
    let toDate = null;
    if (typeof value == 'string') {
      toDate = new Date(value);
    } else toDate = value;

    const jourSemaine = toDate.getDay();
    let nomJour;
    switch (jourSemaine) {
      case 0:
        nomJour = 'Dim';
        break;
      case 1:
        nomJour = 'Lun';
        break;
      case 2:
        nomJour = 'Mar';
        break;
      case 3:
        nomJour = 'Mer';
        break;
      case 4:
        nomJour = 'Jeu';
        break;
      case 5:
        nomJour = 'Ven';
        break;
      case 6:
        nomJour = 'Sam';
        break;
      default:
        nomJour = 'Jour inconnu';
    }
    return nomJour;
  }
}
