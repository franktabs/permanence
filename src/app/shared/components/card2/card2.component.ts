import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { IPersonnel } from '../../interfaces/ipersonnel';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-card2',
  templateUrl: './card2.component.html',
  styleUrls: ['./card2.component.scss']
})
export class Card2Component implements OnInit, OnDestroy {

  @Input() title!:string;

  public data!:IPersonnel[] |null 

  constructor(private api:ApiService) { }
  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  private destroy$!:Subject<boolean>;

  ngOnInit(): void {
    this.destroy$=new Subject();
    this.api.personnels$.pipe(takeUntil(this.destroy$)).subscribe((personnels)=>{
      console.log("emission card2", personnels)
      this.data=personnels
    });
  }



}
