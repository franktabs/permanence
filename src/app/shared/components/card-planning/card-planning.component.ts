import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPlanning } from '../../interfaces/iplanning';
import { IPermanence } from '../../interfaces/ipermanence';

@Component({
  selector: 'app-card-planning',
  templateUrl: './card-planning.component.html',
  styleUrls: ['./card-planning.component.scss']
})
export class CardPlanningComponent implements OnInit {

  @Input() planning!:IPlanning;

  @Output() planningEmit:EventEmitter<IPlanning> = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
  }


  handleClick(){
    this.planningEmit.emit(this.planning)
  }

  handleSave(){
    console.log()
  }
}
