import { Component, OnInit } from '@angular/core';
import { DataPlanning } from 'src/app/shared/components/modal-planification/modal-planification.component';
import { checkPointDate, countDate } from 'src/app/shared/utils/function';

type Remplissage = {
  month: number;
  superviseur: number;
  pointDate: number[];
};

@Component({
  selector: 'app-page-plannification',
  templateUrl: './page-plannification.component.html',
  styleUrls: [
    './page-plannification.component.scss',
    '../shared/styles/styles.scss',
  ],
})
export class PagePlannificationComponent implements OnInit {
  public openModalPlanification: boolean = false;

  public start: Date = new Date('2023-08-13');
  public tabDays: number[] = [];

  private _dataPlanning: DataPlanning | null = null;

  public remplissage: Remplissage = {
    month: -1,
    superviseur: 0,
    pointDate: [],
  };

  

  constructor() {}

  ngOnInit(): void {}

  handleModalPlanification() {
    this.openModalPlanification = true;
  }

  set dataPlanning(value: DataPlanning | null) {
    this._dataPlanning = value;
    console.log('données recus');
    if (value) {
      console.log('données pret');
      this.generatePlanning(+value.periode);
    }
  }

  get dataPlanning() {
    return this._dataPlanning;
  }

  generatePlanning(m: number) {
    this.remplissage = { month: -1, superviseur: 0, pointDate: [] };
    let fistDate = new Date();
    let thatDate = new Date(fistDate.getFullYear(), fistDate.getMonth(), 1);
    thatDate.setMonth(thatDate.getMonth() + 1);
    let end = new Date(thatDate.getTime());
    let start = new Date(thatDate.getTime());

    while (start.getDay() != 1) {
      start.setDate(start.getDate() + 1);
    }

    for (let i = 1; i <= m; i++) {
      let newDate = new Date(end.getTime());
      newDate.setMonth(newDate.getMonth() + i);
      let datePoint = checkPointDate(newDate);
      let coutDay = countDate(start, datePoint);
      this.remplissage.pointDate.push(coutDay);
    }
    end.setMonth(end.getMonth() + m);
    if (end.getDay() == 1 && end.getDate() == 1) {
      end.setDate(end.getDate() - 1);
    } else {
      while (end.getDay() != 0) {
        end.setDate(end.getDate() + 1);
      }
    }
    let nbrDays = countDate(start, end);

    let oneDay = new Date(start.getTime());
    oneDay.setDate(oneDay.getDate() + nbrDays);

    let dayMinus = 0;
    if (end.getDate() < oneDay.getDate()) {
      dayMinus = -1;
    }
    this.start = start;
    this.tabDays = Array.from(
      { length: nbrDays + 1 + dayMinus },
      (_, ind) => ind
    );

    console.log('all checkpoint', this.remplissage);
  }

  addDay(d: number) {
    let startDay = new Date(this.start.getTime());
    startDay.setDate(startDay.getDate() + d);
    return startDay;
  }

  receiveData(data: any) {
    this.dataPlanning = data;
  }

  isSuperviseur(d: number): boolean {
    let startDay = new Date(this.start.getTime());
    startDay.setDate(startDay.getDate() + d);
    if (startDay.getMonth() != this.remplissage.month) {
      this.remplissage.month = startDay.getMonth();
      return true;
    }
    return false;
  }

  displaySuperviseur(n: number): string {
    let dataSuperviseur = this.dataPlanning?.superviseur[n];
    if (typeof dataSuperviseur === 'string') {
      return dataSuperviseur;
    } else if (dataSuperviseur) {
      return dataSuperviseur.nom as string;
    }
    return '';
  }

  genTabNum(n: number, i: number): number[] {
    if (i < 0) {
      return Array.from({ length: n + 1 }, (_, ind) => ind);
    }
    let lastPoint = this.remplissage.pointDate[i];
    let diffPoint = n - lastPoint;
    let dayMinus = 0;
    let date = new Date(this.start.getTime());
    date.setDate(date.getDate() + lastPoint);
    console.log("for ", n, "la date est ", date.getDay())
    if (date.getDay() ==1 || date.getDay()==0) {
      dayMinus = -1;
    }
    let indiceMinus = 0;
    if(i>0) {
      indiceMinus = -1
      dayMinus = 0
    }
    return Array.from({ length: diffPoint + dayMinus  }, (_, ind) => ind + 1 + indiceMinus);
  }
}
