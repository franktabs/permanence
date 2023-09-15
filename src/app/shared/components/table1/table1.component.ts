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
@Component({
  selector: 'app-table1',
  templateUrl: './table1.component.html',
  styleUrls: ['./table1.component.scss'],
})
export class Table1Component
  implements AfterViewInit, OnDestroy, OnChanges, OnInit
{


  public displayedColumns: Array<keyof TypePersonnel> = [
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

  private _paginator!:MatPaginator;

  @Input() icon!: string;
  @Input() title!: TitleCard1;
  @Input() personnels: TypePersonnel[] | null = null;
  @Input() search: string = '';


  @Input()
  public iconAdd!:string;

  @Output()
  public toAdd:EventEmitter<TitleModalForm> = new EventEmitter();


  private destroy$!: Subject<boolean>;

  public refreshData: boolean = false;

  @ViewChild(MatPaginator, { static: false })
  set paginator(value: MatPaginator) {
    this._paginator = value;
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }

  get paginator(){
    return this._paginator;
  }


  @ViewChild(MatSort) sort!: MatSort;

  
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
    if (changes['personnels']) {
      let newData:TypePersonnel[] =  changes['personnels'].currentValue
      this.dataSource = new MatTableDataSource<TypePersonnel>(
        newData
        );
        console.log('changement données du personnels');
        // this.paginator.length = (newData || []).length;
        // this.paginator.firstPage();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      
    }
    if (changes['search']) {
      this.dataSource.filter = this.search.trim();
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  ngAfterViewInit(): void {
    this.destroy$ = new Subject();
    // this.api.getAllData<TypePersonnel[]>({for:"personnels"}).pipe(takeUntil(this.destroy$)).subscribe({
    //   next:(personnels)=>{
    //     this.api.personnels$.next(personnels);
    //     this.dataSource = new MatTableDataSource<TypePersonnel>(personnels);
    //     this.dataSource.sort = this.sort;
    //   },
    //   error:(err)=>{this.errorMessage = err}
    // })
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

    this.row = row;
    this.openModal = true;

    // this.dialog.open(UserInfoModalComponent, {
    //   data: row
    // })
  }

  customFilter(filterValue: string, item: TypePersonnel): boolean {
    console.log('element à filtrer', item, 'avec la chaine', filterValue);
    return Object.values(item).includes(filterValue);
  }


  public handleAdd(titre:TitleModalForm){
    this.toAdd.emit(titre);
  }

}
