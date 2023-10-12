import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IPersonnel } from '../../interfaces/ipersonnel';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { Observable, Subject, throwError } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { UserInfoModalComponent } from '../modals/user-info-modal/user-info-modal.component';
import { TypePersonnel } from '../../utils/types-map';
import { TitleCard1 } from '../card1/card1.component';
import { TitleModalForm } from '../modal-form-model/modal-form-model.component';
import { IApiPersonnel } from '../../interfaces/iapipersonnel';
import { IApiDirection } from '../../interfaces/iapidirection';
import { IApiDepartement } from '../../interfaces/iapidepartement';
import { flush } from '@angular/core/testing';


type PropagationTable1 = "ADD"|'UPDATE' | 'REMOVE' | null;

export type HandleActionTable1 = {titre: TitleModalForm, action:PropagationTable1, row?:unknown};
export type TypeTable1 = "PERSONNEL"|"DIRECTION"|"DEPARTEMENT";

@Component({
  selector: 'app-table1',
  templateUrl: './table1.component.html',
  styleUrls: ['./table1.component.scss'],
})
export class Table1Component
  implements AfterViewInit, OnDestroy, OnChanges, OnInit
{
  public displayedColumns: Array<keyof TypePersonnel | 'action' | keyof IApiDirection | keyof IApiDepartement > = [
    'action',
    'firstname',
    'sexe',
    'emailaddress',
    'fonction',
    'service',
  ];
  public dataSource: MatTableDataSource<TypePersonnel> =
    new MatTableDataSource<TypePersonnel>([]);
  public errorMessage: string = '';
  public openModal: boolean = false;
  public row: TypePersonnel | null = null;

  public propagation: PropagationTable1 = null;

  private _paginator!: MatPaginator;

  @Input() icon!: string;
  @Input() title!: TitleCard1;
  @Input() datas_table: TypePersonnel[] | null | IApiDepartement[] | IApiDirection[] = null;
  @Input() search: string = '';
  @Input() type!:TypeTable1;
  @Input() iconAdd!: string;

  @Output()
  public handleActionEmit: EventEmitter<HandleActionTable1> = new EventEmitter();

  private destroy$!: Subject<boolean>;

  public refreshData: boolean = false;

  @ViewChild(MatPaginator, { static: false })
  set paginator(value: MatPaginator) {
    this._paginator = value;
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }

  get paginator() {
    return this._paginator;
  }

  @ViewChild(MatSort, {static:false}) sort!: MatSort;

  // set sort(value: MatSort) {
  //   // if(!value){
  //     console.log("valeur de sort", value, )
  //     if (this.dataSource && !this.dataSource.sort) {
  //       this.dataSource.sort = value;
  //     }
  //   // }
  // }

  // @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private api: ApiService,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datas_table']) {
      let newData: TypePersonnel[] = changes['datas_table'].currentValue;
      this.dataSource = new MatTableDataSource<TypePersonnel>(newData);
      console.log('changement données du datas_table', newData);
      // this.paginator.length = (newData || []).length;
      // this.paginator.firstPage();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    if (changes['search']) {
      this.dataSource.filter = this.search.trim();
    }
    if(changes['type']){
      let currentValue:TypeTable1 = changes['type'].currentValue;
      if(currentValue=="PERSONNEL"){
        this.displayedColumns = [
          'action',
          'firstname',
          'sexe',
          'emailaddress',
          'fonction',
          'service',
        ];
      }else if(currentValue=="DEPARTEMENT"){
        this.displayedColumns = ["action", "name", "direction"]
      }else if(currentValue=="DIRECTION"){
        this.displayedColumns = ["action", "name"]

      }
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  ngAfterViewInit(): void {
    this.destroy$ = new Subject();
    // this.api.getAllData<TypePersonnel[]>({for:"datas_table"}).pipe(takeUntil(this.destroy$)).subscribe({
    //   next:(datas_table)=>{
    //     this.api.datas_table$.next(datas_table);
    //     this.dataSource = new MatTableDataSource<TypePersonnel>(datas_table);
    //     this.dataSource.sort = this.sort;
    //   },
    //   error:(err)=>{this.errorMessage = err}
    // })
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  public handleClick(row: TypePersonnel) {
    console.log('handle click row data ', row);

    if (this.propagation == 'REMOVE') {
      console.log('suppression de ', row);
      this.handleAction({titre:this.type, action:"REMOVE", row:row})
    } else if (this.propagation == 'UPDATE') {
      console.log('modification de ', row, "du type ", this.type);
      this.handleAction({titre:this.type, action:"UPDATE", row:row})
    } else if (this.propagation == null) {
      this.row = row;
      this.openModal = true;
    }
    this.propagation = null;

    // this.dialog.open(UserInfoModalComponent, {
    //   data: row
    // })
  }

  customFilter(filterValue: string, item: TypePersonnel): boolean {
    console.log('element à filtrer', item, 'avec la chaine', filterValue);
    return Object.values(item).includes(filterValue);
  }

  public handleAction(attr:HandleActionTable1) {
    this.handleActionEmit.emit(attr);
  }

  actionIcon(event: Event | null, propagation: PropagationTable1) {
    this.propagation = propagation;
  }

  importFile(event:any){

    //Nettoyer le resultat;
    if(event instanceof Array && event.length){
        let i = 0
        let tabs = JSON.parse(JSON.stringify(event))
        for(let line of event){

            let keys = Object.keys(line);
            let clear = true;
            for(let key of keys){
                if(line[key]){
                    clear = false

                    break;
                }
            }
            if(clear){
                tabs.splice(i, 1)
                i--;
            }
            i++;
        }
        console.log("result import =>", tabs, event);
    }
  }
}
