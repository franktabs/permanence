import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { IPersonnel } from '../../interfaces/ipersonnel';
import { Observable, Subject, takeUntil } from 'rxjs';
import { TypePersonnel } from '../../utils/types-map';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../services/auth.service';
import { IApiPersonnel } from '../../interfaces/iapipersonnel';
import { INotification } from '../../interfaces/inotification';
import { IAnnonce } from '../../interfaces/iannonce';
import { OptionalKey } from '../../utils/type';


//Carte sur pour afficher les évènements, historique
@Component({
  selector: 'app-card2',
  templateUrl: './card2.component.html',
  styleUrls: ['./card2.component.scss']
})
export class Card2Component implements OnInit, OnDestroy {

  @Input() title!:string;
  // @Input() dataSource!:MatTableDataSource<TypePersonnel>
  @Input() personnels!:TypePersonnel[] | null;

  public notifications!:INotification[]|undefined;

  constructor(private api:ApiService, private auth:AuthService) { }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  private destroy$!:Subject<boolean>;

  ngOnInit(): void {
    this.destroy$=new Subject();
    this.notifications = this.auth.user?.notifications
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //     if(changes["dataSource"]){
  //       let changeDataSource: MatTableDataSource<TypePersonnel> = changes["dataSource"].currentValue;
  //       this.personnels = changeDataSource.data
  //       console.log("tableau venant de dataSource",this.personnels)
  //     }
  // }

  getNameEmetteur(annonce:OptionalKey<IAnnonce>){
    // console.log("nom personne=>", annonce);
    return annonce.emetteur?.firstname
  }

  // getDate(annonce:IAnnonce){
  //   if(!annonce.submissionDate) return ""
  //   else{
  //     let dateString   = annonce.submissionDate;
  //     let date = new Date(Date.parse(dateString));
      
  //   }
  // }

}
