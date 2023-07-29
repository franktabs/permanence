import { Component, OnInit } from '@angular/core';
import { OuputTypeCard1 } from 'src/app/shared/components/card1/card1.component';

@Component({
  selector: 'app-page-collecte-data',
  templateUrl: './page-collecte-data.component.html',
  styleUrls: ['./page-collecte-data.component.scss', "../shared/styles/styles.scss"]
})
export class PageCollecteDataComponent implements OnInit {

  public date1Conge:Date = new Date("2023-06-27")
  public date2Conge:Date = new Date("2023-07-27")
  public toTable1:OuputTypeCard1={icon:"", title:""};
  public direction:string = "DSI"

  public putInActiveIcon(msg:OuputTypeCard1){
    this.toTable1 = msg;
  }

  constructor() { }

  ngOnInit(): void {
    console.log(this.date1Conge, this.date2Conge);
    this.toTable1.icon="<i class='bi bi-person-lines-fill' ></i>";
    this.toTable1.title="Données Congés"
  }

}
