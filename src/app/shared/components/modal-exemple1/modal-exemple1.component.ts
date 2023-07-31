import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal-exemple1',
  templateUrl: './modal-exemple1.component.html',
  styleUrls: ['./modal-exemple1.component.scss']
})
export class ModalExemple1Component implements OnInit {

  @Input() close:boolean = true;
  @Output() closeChange:EventEmitter<boolean> = new EventEmitter() 
  @Input() nameModal!:string ;

  constructor() { }

  ngOnInit(): void {
  }

  up(){
    this.closeChange.emit(true)
  }

}
