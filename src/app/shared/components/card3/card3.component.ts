import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card3',
  templateUrl: './card3.component.html',
  styleUrls: ['./card3.component.scss']
})
export class Card3Component implements OnInit {

  public closeModal:boolean = true;
  public closeModal2:boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
