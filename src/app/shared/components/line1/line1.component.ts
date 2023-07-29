import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-line1',
  templateUrl: './line1.component.html',
  styleUrls: ['./line1.component.scss']
})
export class Line1Component implements OnInit {

  @Input()
  public nom!:string;

  @Input()
  public date!:string
  constructor() { }

  ngOnInit(): void {
  }

}
