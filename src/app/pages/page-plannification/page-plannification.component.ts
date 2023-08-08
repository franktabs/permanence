import { Component, OnInit } from '@angular/core';
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

  constructor() {}

  ngOnInit(): void {}

  handleModalPlanification() {
    this.openModalPlanification = true;
    this.generatePlanning(1)
  }

  generatePlanning(m: number) {
    let fistDate = new Date();
    let thatDate = new Date(fistDate.getFullYear(), fistDate.getMonth(), 1);
    thatDate.setMonth(thatDate.getMonth() + m);
    let end = new Date(thatDate.getTime());
    let start = new Date(thatDate.getTime());
    while (start.getDay() != 1) {
      start.setDate(start.getDate() + 1);
    console.log("jour ",  start.getDay())

    }
    end.setMonth(end.getMonth() + 1);
    while (end.getDay() != 0) {
      end.setDate(end.getDate() + 1);
    }

    let nbrDays = countDate(start, end);
    this.start = start;
    this.tabDays = Array.from({ length: nbrDays+1 }, (_, ind) => ind);
    console.log("tableau day", this.tabDays)
  }

  addDay(d: number) {
    let startDay = new Date(this.start.getTime());
    startDay.setDate(startDay.getDate() + d);
    return startDay;
  }
}
