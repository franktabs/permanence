import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { OuputTypeCard1 } from 'src/app/shared/components/card1/card1.component';
import { IDirection } from 'src/app/shared/interfaces/idirection';
import { IHolidays } from 'src/app/shared/interfaces/iholidays';
import { IPersonnel } from 'src/app/shared/interfaces/ipersonnel';
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-page-collecte-data',
  templateUrl: './page-collecte-data.component.html',
  styleUrls: ['./page-collecte-data.component.scss', "../shared/styles/styles.scss"]
})
export class PageCollecteDataComponent implements OnInit, OnDestroy {

  public date1Conge: Date = new Date("2023-06-27")
  public date2Conge: Date = new Date("2023-07-27")
  public toTable1: OuputTypeCard1 = { icon: "", title: "" };
  private _directionSelected: string | null = null;
  private _data_apiDirections: IDirection[] | null = null;
  public _data_apiPersonnels: IPersonnel[] | null = null;
  public allPersonnels: IPersonnel[] | null = null;
  public allUsers: IPersonnel[] | null = null;
  public isTableFilter:boolean = false;


  constructor(private api: ApiService) { }

  public set data_apiPersonnels(value: IPersonnel[] | null){
    this._data_apiPersonnels = value;
    if(this._data_apiPersonnels && this.allPersonnels){
      if(this._data_apiPersonnels.length<this.allPersonnels.length){
        this.isTableFilter=true;
      }else{
        this.isTableFilter=false;
        this.directionSelected=null;
        this.toTable1= {icon:"<i class='bi bi-person-lines-fill' ></i>","title":"Personnel"}
      }
    }
  }

  public get data_apiPersonnels(){
    return this._data_apiPersonnels;
  }

  public set directionSelected(value: string | null) {
    this._directionSelected = value;
    if (this._directionSelected && this.allPersonnels && this.allPersonnels.length) {
      this.data_apiPersonnels = this.allPersonnels?.filter((items) => { return items.direction?.nom == this._directionSelected })
    } 
  }

  public get directionSelected() {
    return this._directionSelected;
  }

  public set data_apiDirections(value: IDirection[] | null) {
    this._data_apiDirections = value;
    console.log("changement de data_apiDirecions")
    // if (this._data_apiDirections && this._data_apiDirections.length) {
    //   this.directionSelected = this._data_apiDirections[0].nom
    // } else {
    //   this.directionSelected = null;
    // }
  }

  public get data_apiDirections() {
    return this._data_apiDirections;
  }

  public resetTable(){
    this.data_apiPersonnels = this.allPersonnels;
  }
  public putInActiveIcon(msg: OuputTypeCard1) {
    this.toTable1 = msg;
  }

  public getPersonnelsHoliday() {
    if(this.data_apiPersonnels){
      let personnelsHoliday = this.data_apiPersonnels.filter((items) => {
        if(items.holiday?.debut){
          let seconde = Math.floor((+new Date(items.holiday.debut) - (+new Date())) / 1000);
          return seconde > 0;
        }
        return false;
      })
      this.data_apiPersonnels = personnelsHoliday;
    }

  }

  public destroy$!: Subject<boolean>;

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  ngOnInit(): void {
    this.destroy$ = new Subject();
    console.log(this.date1Conge, this.date2Conge);
    this.toTable1.icon = "<i class='bi bi-person-lines-fill' ></i>";
    this.toTable1.title = "Personnel";
    this.api.getAllData<IDirection[]>({ for: "directions" }).subscribe((directions) => {
      this.api.directions$.next(directions);
      this.data_apiDirections = directions;
      // this.api.directions$.pipe(takeUntil(this.destroy$)).subscribe((s)=>{
      //   this.data_apiDirections = s;
      // })
    });
    this.api.getAllData<IPersonnel[]>({ for: "personnels" }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (personnels) => {
        this.api.personnels$.next(personnels);
        let allUserPersonnel = personnels.filter((items)=>{return !items.admin && !items.superviseur})
        this.data_apiPersonnels = allUserPersonnel;
        this.allPersonnels = allUserPersonnel;
        this.allUsers=allUserPersonnel;
      }
    })
  }

}
