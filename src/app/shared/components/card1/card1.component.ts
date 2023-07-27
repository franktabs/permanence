import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card1',
  templateUrl: './card1.component.html',
  styleUrls: ['./card1.component.scss']
})
export class Card1Component implements OnInit {

  @Input()
  public title!:string;

  @Input()
  public icon!:string;

  @Input()
  public date1!:Date;

  @Input()
  public date2!:Date;
  constructor() { }

  ngOnInit(): void {
  }

}
