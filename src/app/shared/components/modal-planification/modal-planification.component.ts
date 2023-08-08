import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable, Subject } from 'rxjs';

type Ferier = {jour:string, type:"ouvrable"|"non ouvrable"|"simple"}

@Component({
  selector: 'app-modal-planification',
  templateUrl: './modal-planification.component.html',
  styleUrls: ['./modal-planification.component.scss']
})
export class ModalPlanificationComponent implements OnInit {

  @Output() openChange:EventEmitter<boolean> = new EventEmitter()

  public superviseur:string[] = ["", "", ""];
  private _periode:number = 3;
  public arrayNumPeriode:number[] = [1, 2, 3]
  public feriers:Ferier[] = []
  // public numberFerier:number[] = [1];
  // public tailleFerier:number = this.ferier.length;


  constructor() { }

  ngOnInit(): void {
  }

  @Input()
  set open(bool:boolean ) {
      if(bool == false){
        this.openChange.emit(false)
      }
  }

  public set periode(n:number|string){
    if(typeof n =="string"){
      this._periode = +n
    }else this._periode=n;
    this.arrayNumPeriode =  Array.from({ length: this._periode }, (_, index) => index + 1)
  }

  public get periode(){
    return this._periode;
  }

  public ajoutFerier (){
    this.feriers.push({jour:"", type:"simple"});
    // this.numberFerier = Array.from({ length: this.ferier.length }, (_, index) => index + 1);
  }

  public suprFerier(i:number){
    this.feriers.splice(i,1);
    // this.numberFerier = Array.from({ length: this.ferier.length }, (_, index) => index + 1);
  }

}
