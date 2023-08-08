import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class DayComponent implements OnInit, OnChanges {

  @Input() date!:Date;
  @Input() typeFerier:"ouvrable"|"non ouvrable"|"simple" = "simple";
  public ordinaire:boolean = true;

  

  constructor() { }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["date"]){
      let newDate = changes["date"].currentValue ;
      this.ordinaire = newDate.getDay()!=0 && newDate.getDay()!=6 && this.typeFerier=='simple';
    }
  }


 


}
