import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import {MatTableDataSource, MatTableModule} from "@angular/material/table"
import { IPersonnel } from '../../interfaces/ipersonnel';
import {HttpClient, HttpErrorResponse} from "@angular/common/http"
import { ApiService } from '../../services/api.service';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { Observable, Subject, throwError } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
@Component({
  selector: 'app-table1',
  templateUrl: './table1.component.html',
  styleUrls: ['./table1.component.scss'], 
})
export class Table1Component implements AfterViewInit, OnDestroy, OnChanges {

  public displayedColumns:Array<keyof IPersonnel> = ["nom", "prenom", "date_naissance", "sexe", "matricule"]
  public dataSource!:MatTableDataSource<IPersonnel>;
  public errorMessage:string="";

  @ViewChild(MatPaginator) paginator! :MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() icon!:string;
  @Input() title!:string;
  @Input() personnels!:IPersonnel[] | null;

  private destroy$!:Subject<boolean> 


  constructor(private http:HttpClient, private api:ApiService, private _liveAnnouncer: LiveAnnouncer ) { }


  ngOnChanges(changes: SimpleChanges): void {
    if(changes["personnels"]){
      this.dataSource = new MatTableDataSource<IPersonnel>(changes["personnels"].currentValue);
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
  
  ngAfterViewInit(): void {
    this.destroy$ =  new Subject();
    // this.api.getAllData<IPersonnel[]>({for:"personnels"}).pipe(takeUntil(this.destroy$)).subscribe({
    //   next:(personnels)=>{
    //     this.api.personnels$.next(personnels);
    //     this.dataSource = new MatTableDataSource<IPersonnel>(personnels);
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

}
