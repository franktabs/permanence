import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IPersonnel } from '../../interfaces/ipersonnel';

@Component({
  selector: 'app-modal1',
  templateUrl: './modal1.component.html',
  styleUrls: ['./modal1.component.scss']
})
export class Modal1Component implements OnInit, OnChanges {

  @Input() isOpen!:boolean ;

  @Output() isOpenChange:EventEmitter<boolean> = new EventEmitter() 

  @Input() rows!:IPersonnel | any;

  public keyRow: Array<keyof IPersonnel> = []

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['rows']){
      let obj = changes['rows'].currentValue;
      this.keyRow = Object.keys(obj).filter((item)=>{
        if(typeof obj[item] =="string"){
          return true
        }
        return false
      })as any;
    }
  }

  ngOnInit(): void {

  }

  closeModal(){
    this.isOpenChange.emit(false);
  }

}
