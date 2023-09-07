import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IPermanence } from '../../interfaces/ipermanence';
import { IApiPersonnel } from '../../interfaces/iapipersonnel';
import { IMonth } from '../../interfaces/imonth';

@Component({
  selector: 'app-modal-days-permanence',
  templateUrl: './modal-days-permanence.component.html',
  styleUrls: ['./modal-days-permanence.component.scss']
})
export class ModalDaysPermanenceComponent implements OnInit {

  public personnel!:IApiPersonnel;
  public nbrApparition:number = 0;
  public months:IMonth[]= [];


  constructor(@Inject(MAT_DIALOG_DATA) public data: {months:IMonth[], personnel:IApiPersonnel}) { }

  ngOnInit(): void {
    this.months = this.data.months;
    this.personnel = this.data.personnel;

    for(let month of this.months){
      this.nbrApparition +=month.permanences?.length || 0;
      month.permanences?.sort((permaence1, permanence2)=>{
        return permaence1.date.localeCompare(permanence2.date);
      })
    }
  }

}
