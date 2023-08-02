import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { IPersonnel } from '../../interfaces/ipersonnel';
import { Observable, Subject, takeUntil } from 'rxjs';


//Carte sur pour afficher les évènements, historique
@Component({
  selector: 'app-card2',
  templateUrl: './card2.component.html',
  styleUrls: ['./card2.component.scss']
})
export class Card2Component implements OnInit, OnDestroy {

  @Input() title!:string;
  @Input() personnels!:IPersonnel[] | null;

  constructor(private api:ApiService) { }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  private destroy$!:Subject<boolean>;

  ngOnInit(): void {
    this.destroy$=new Subject();
  }



}
