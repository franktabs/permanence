import { Component, OnInit } from '@angular/core';
import { DataPlanning } from 'src/app/shared/components/modal-planification/modal-planification.component';
import { countDate } from 'src/app/shared/utils/function';

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

  private _dataPlanning:DataPlanning|null = null;

  constructor() {}

  ngOnInit(): void {}

  handleModalPlanification() {
    this.openModalPlanification = true;
  }

  set dataPlanning(value:DataPlanning|null){
    this._dataPlanning = value;
    console.log("données recus")
    if(value){
      console.log("données pret");
      this.generatePlanning(+value.periode)
    }
  }

  get dataPlanning(){
    return this._dataPlanning;
  }

  generatePlanning(m: number) {
    let fistDate = new Date();
    let thatDate = new Date(fistDate.getFullYear(), fistDate.getMonth(), 1);
    thatDate.setMonth(thatDate.getMonth() + 1);
    let end = new Date(thatDate.getTime());
    let start = new Date(thatDate.getTime());

    while (start.getDay() != 1) {
      start.setDate(start.getDate() + 1);
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
    console.log('end Vrai day', end.toLocaleDateString());
    console.log('end day =>', oneDay.toLocaleDateString());

    let dayMinus = 0;
    if (end.getDate() < oneDay.getDate()) {
      dayMinus = -1;
    }
    this.start = start;
    this.tabDays = Array.from(
      { length: nbrDays + 1 + dayMinus },
      (_, ind) => ind
    );
    console.log('tableau day', this.tabDays);
  }

  addDay(d: number) {
    let startDay = new Date(this.start.getTime());
    startDay.setDate(startDay.getDate() + d);
    return startDay;
  }

  receiveData(data:any){
    this.dataPlanning = data
  }
}
