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

  @Output() permanencesEmit:EventEmitter<IPermanence[]> = new EventEmitter()

  constructor() { }

  ngOnInit(): void {
  }


  handleClick(){
    this.permanencesEmit.emit(this.planning.permanences)
  }
}
