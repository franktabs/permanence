import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-page-plannification',
  templateUrl: './page-plannification.component.html',
  styleUrls: ['./page-plannification.component.scss', "../shared/styles/styles.scss"]
})
export class PagePlannificationComponent implements OnInit {

  public openModalPlanification:boolean=false;

  public start:Date = new Date("2023-08-08")

  constructor() { }

  ngOnInit(): void {
  }

  handleModalPlanification(){
    this.openModalPlanification = true;
  }

}
