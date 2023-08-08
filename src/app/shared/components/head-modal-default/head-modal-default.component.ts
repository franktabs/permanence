import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-head-modal-default',
  templateUrl: './head-modal-default.component.html',
  styleUrls: ['./head-modal-default.component.scss']
})
export class HeadModalDefaultComponent implements OnInit {

  
  @Input() open : boolean = false;
  @Input() icon !:string;
  @Output() openChange: EventEmitter<boolean> = new EventEmitter();

  @Input() nameModal!:string;

  constructor() { }

  ngOnInit(): void {
  }

  closeModal(){
    this.openChange.emit(false)
  }

}
