import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
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
import { MatPaginator } from '@angular/material/paginator';

//Carte sur pour afficher les évènements, historique
@Component({
  selector: 'app-card2',
  templateUrl: './card2.component.html',
  styleUrls: ['./card2.component.scss'],
})
export class Card2Component implements OnInit, OnDestroy {
  @Input() title!: string;
  // @Input() dataSource!:MatTableDataSource<TypePersonnel>
  @Input() personnels!: TypePersonnel[] | null;

  public notifications!: INotification[] | undefined;

  public displayedNotifications: INotification[] = [];

  private _paginator!: MatPaginator;

  @ViewChild(MatPaginator, { static: false })
  set paginator(value: MatPaginator) {
    this._paginator = value;
    setTimeout(() => {
      this._paginator.page.subscribe(() => this.updateDisplayedItems());
      this.updateDisplayedItems();
    });
  }

  get paginator() {
    return this._paginator;
  }

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  private destroy$!: Subject<boolean>;

  ngOnInit(): void {
    this.destroy$ = new Subject();
    let tabNotifications = this.auth.user?.notifications;
    tabNotifications?.sort((notif1, notif2) => {
      if (notif2.annonce.submissionDate) {
        return notif2.annonce.submissionDate.localeCompare(
          notif1.annonce.submissionDate || ''
        );
      } else return 0;
    });
    this.notifications = tabNotifications;
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //     if(changes["dataSource"]){
  //       let changeDataSource: MatTableDataSource<TypePersonnel> = changes["dataSource"].currentValue;
  //       this.personnels = changeDataSource.data
  //       console.log("tableau venant de dataSource",this.personnels)
  //     }
  // }

  getNameEmetteur(annonce: OptionalKey<IAnnonce>) {
    // console.log("nom personne=>", annonce);
    return annonce.emetteur?.firstname;
  }

  // getDate(annonce:IAnnonce){
  //   if(!annonce.submissionDate) return ""
  //   else{
  //     let dateString   = annonce.submissionDate;
  //     let date = new Date(Date.parse(dateString));

  //   }
  // }

  ngAfterViewInit() {}

  updateDisplayedItems() {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    const endIndex = startIndex + this.paginator.pageSize;
    this.displayedNotifications = (this.notifications || []).slice(
      startIndex,
      endIndex
    );
  }
}
