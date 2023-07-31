import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal-exemple1',
  templateUrl: './modal-exemple1.component.html',
  styleUrls: ['./modal-exemple1.component.scss']
})
export class ModalExemple1Component implements OnInit {

  @Input() close:boolean = true;
  @Input() nameModal!:string ;
  @Output() closeChange:EventEmitter<boolean> = new EventEmitter() 

  constructor() { }

  ngOnInit(): void {
  }

  up(){
    this.closeChange.emit(true)
  }

}
