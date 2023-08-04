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
@Component({
  selector: 'app-table1',
  templateUrl: './table1.component.html',
  styleUrls: ['./table1.component.scss'],
})
export class Table1Component
  implements AfterViewInit, OnDestroy, OnChanges, OnInit
{
  public displayedColumns: Array<keyof TypePersonnel> = [
    'nom',
    'sexe',
    'email',
    'fonction',
    'service',
  ];
  public dataSource: MatTableDataSource<TypePersonnel> =
    new MatTableDataSource<TypePersonnel>([]);
  public errorMessage: string = '';
  public openModal: boolean = false;
  public row: TypePersonnel | null = null;

  @ViewChild(MatPaginator, { static: false })
  set paginator(value: MatPaginator) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }
  @ViewChild(MatSort) sort!:MatSort
  // set sort(value: MatSort) {
  //   // if(!value){
  //     console.log("valeur de sort", value, )
  //     if (this.dataSource && !this.dataSource.sort) {
  //       this.dataSource.sort = value;
  //     }
  //   // }
  // }

  // @ViewChild(MatSort) sort!: MatSort;

  @Input() icon!: string;
  @Input() title!: string;
  @Input() personnels!: TypePersonnel[] | null;

  private destroy$!: Subject<boolean>;

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
      this.dataSource = new MatTableDataSource<TypePersonnel>(
        changes['personnels'].currentValue
      );
      this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

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
}
