import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-collecte-data',
  templateUrl: './page-collecte-data.component.html',
  styleUrls: ['./page-collecte-data.component.scss', "../shared/styles/styles.scss"]
})
export class PageCollecteDataComponent implements OnInit {

  public date1Conge:Date = new Date("2023-06-27")
  public date2Conge:Date = new Date("2023-07-27")

  constructor() { }

  ngOnInit(): void {
    console.log(this.date1Conge, this.date2Conge)
  }

}
