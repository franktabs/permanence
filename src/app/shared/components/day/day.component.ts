import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnInit {

  @Input() date!:Date;
  @Input() typeFerier:"ouvrable"|"non ouvrable"|"simple" = "simple";
  public ordinaire:boolean = true;

  constructor() { }

  ngOnInit(): void {
    this.ordinaire = this.date.getDay()!=5 || this.date.getDay()!=6 || this.typeFerier=='ouvrable'
  }

}
