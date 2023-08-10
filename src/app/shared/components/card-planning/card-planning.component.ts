import { Component, Input, OnInit } from '@angular/core';
import { IPlanning } from '../../interfaces/iplanning';

@Component({
  selector: 'app-card-planning',
  templateUrl: './card-planning.component.html',
  styleUrls: ['./card-planning.component.scss']
})
export class CardPlanningComponent implements OnInit {

  @Input() planning!:IPlanning;

  constructor() { }

  ngOnInit(): void {
  }

}
