import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, map, takeUntil, tap } from 'rxjs';
import { OuputTypeCard1 } from 'src/app/shared/components/card1/card1.component';
import { IApiRemplacement } from 'src/app/shared/interfaces/iapiremplacement';
import { IApiDirection } from 'src/app/shared/interfaces/iapidirection';
import { IApiHoliday } from 'src/app/shared/interfaces/iapiholiday';
import { IApiPersonnel } from 'src/app/shared/interfaces/iapipersonnel';
import { IDirection } from 'src/app/shared/interfaces/idirection';
import { IHolidays } from 'src/app/shared/interfaces/iholidays';
import { IPersonnel } from 'src/app/shared/interfaces/ipersonnel';
import { ApiService } from 'src/app/shared/services/api.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import {
  TypeFormatJSON,
  formatJSON,
  formater,
  mapJSON,
} from 'src/app/shared/utils/function';
import { mapDirection, mapPersonnel } from 'src/app/shared/utils/tables-map';
import { TypeDirection, TypePersonnel } from 'src/app/shared/utils/types-map';

interface IApiPerson {
  name: string;
  prename: string;
  age: number;
  sex: 'F' | 'M';
  profes?: string;
  tabs: any;
}

interface IPerson {
  nom: string;
  prenom: string;
  age: number;
  sexe: 'F' | 'M';
  profession: string;
}

let apiPerson: IApiPerson = {
  name: 'frank',
  prename: 'junior',
  age: 12,
  sex: 'F',
  profes: 'ingénieur',
  tabs: [
    {
      moi: 'jean',
    },
  ],
};

@Component({
  selector: 'app-page-collecte-data',
  templateUrl: './page-collecte-data.component.html',
  styleUrls: [
    './page-collecte-data.component.scss',
    '../shared/styles/styles.scss',
  ],
})
export class PageCollecteDataComponent implements OnInit, OnDestroy, OnChanges {
  public date1Conge: Date = new Date('2023-06-27');
  public date2Conge: Date = new Date('2023-07-27');
  public toTable1: OuputTypeCard1 = { icon: '', title: '' };
  private _directionSelected: string | null = null;
  private _data_apiDirections: TypeDirection[] | null = null;
  public _data_apiPersonnels: TypePersonnel[] | null = null;
  public allPersonnels: TypePersonnel[] | null = null;
  public allUsers: TypePersonnel[] | null = null;
  public isTableFilter: boolean = false;
  public userAuth!: TypePersonnel | null;
  public destroy$!: Subject<boolean>;
  public dataSource: MatTableDataSource<TypePersonnel> = new MatTableDataSource<TypePersonnel>([]);
  public search:string = "";

  private _paginator!:MatPaginator;


  @ViewChild(MatPaginator, { static: false })
  set paginator(value: MatPaginator) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }


  get paginator(){
    return this._paginator;
  }

  constructor(private api: ApiService, private auth: AuthService) {}

  public set data_apiPersonnels(value: TypePersonnel[] | null) {
    this._data_apiPersonnels = value;
    
    if (this._data_apiPersonnels && this.allPersonnels) {
      this.dataSource.data = this._data_apiPersonnels;
      this.dataSource.paginator = this.paginator;
      console.log("DataSource =>", this.dataSource)
      if (this._data_apiPersonnels.length < this.allPersonnels.length) {
        this.isTableFilter = true;
      } else {
        this.isTableFilter = false;
        if (this.directionSelected) {
          this.directionSelected = null;
        }
        this.toTable1 = {
          icon: "<i class='bi bi-person-lines-fill' ></i>",
          title: 'Personnel',
        };
      }
    }
  }

  public get data_apiPersonnels() {
    return this._data_apiPersonnels;
  }

  public set directionSelected(value: string | null) {
    this._directionSelected = value;
    this.getPersonnelsDirection();
  }

  public get directionSelected() {
    return this._directionSelected;
  }

  public set data_apiDirections(value: TypeDirection[] | null) {
    this._data_apiDirections = value;
    console.log('changement de data_apiDirecions');
    // if (this._data_apiDirections && this._data_apiDirections.length) {
    //   this.directionSelected = this._data_apiDirections[0].nom
    // } else {
    //   this.directionSelected = null;
    // }
  }

  public get data_apiDirections() {
    return this._data_apiDirections;
  }

  public resetTable() {
    this.data_apiPersonnels = this.allPersonnels;
  }
  public putInActiveIcon(msg: OuputTypeCard1) {
    this.toTable1 = msg;
  }

  public getPersonnelsHoliday() {
    if (this.data_apiPersonnels) {
      let personnelsHoliday = this.data_apiPersonnels.filter((items) => {
        let unkHolidays: IApiHoliday[] = items.vacancies as any
        if (unkHolidays) {
          for (let holiday of unkHolidays) {
            if (holiday?.start) {
              let seconde = Math.floor(
                (+new Date(holiday.start) - +new Date()) / 1000
              );
              return seconde > 0;
            }
          }
        }
        return false;
      });
      this.data_apiPersonnels = personnelsHoliday;
    }
  }

  public getPersonnelsDirection() {
    if (!this.directionSelected) {
      this.data_apiPersonnels = this.allPersonnels;
    } else if (
      this.directionSelected &&
      this.allPersonnels &&
      this.allPersonnels.length
    ) {
      this.data_apiPersonnels = this.allPersonnels.filter((items) => {
        return items.departement?.direction?.name == this.directionSelected;
      });
    }
  }

  public getPersonnelsAbsence() {
    if (this.data_apiPersonnels) {
      let personnelsHoliday = this.data_apiPersonnels.filter((items) => {
        let isTake = false;
        let unkAbsences:IApiRemplacement[] = items.absentList as any
        if (unkAbsences) {
          for (let oneAbsence of unkAbsences) {
            if (oneAbsence.start) {
              let seconde = Math.floor(
                (+new Date(oneAbsence.start) - +new Date()) / 1000
              );
              isTake = seconde > 0;
              if (isTake) break;
            }
          }
        }
        return isTake;
      });
      this.data_apiPersonnels = personnelsHoliday;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  ngOnInit(): void {

    

    this.monTest();
    this.userAuth = this.auth.user;
    this.destroy$ = new Subject();
    console.log(this.date1Conge, this.date2Conge);
    this.toTable1.icon = "<i class='bi bi-person-lines-fill' ></i>";
    this.toTable1.title = 'Personnel';
    
    let existPersonnel = false;

    if(this.api.data["personnels"] && this.api.data.personnels.length){
      console.log("condition d'existence vérifié")
      existPersonnel=true;
      let allUserPersonnel = this.api.data.personnels;
      this.allPersonnels = allUserPersonnel;
      this.data_apiPersonnels = allUserPersonnel;
      this.allUsers = allUserPersonnel;
    }

    this.api.personnels$.subscribe((subs)=>{
      this.api.data["personnels"] = subs
      let allUserPersonnel = subs;
      this.allPersonnels = allUserPersonnel;
      this.data_apiPersonnels = allUserPersonnel;
      this.allUsers = allUserPersonnel;
    })

    this.api
      .getAllData<IApiDirection[]>({ for: 'directions' })
      .subscribe((obs) => {
        
        this.data_apiDirections = mapJSON<IApiDirection, IDirection>(obs || [], mapDirection);
      });
    
    if(!existPersonnel){
      console.log("condition d'existence non vérifié")
      this.api
        .getAllData<IApiPersonnel[]>({ for: 'personnels' })
        .subscribe((subs) => {
          // let dataMap = mapJSON<IApiPersonnel, IPersonnel>(obs, mapPersonnel)
          this.api.data.personnels = subs || [];
          this.api.personnels$.next(subs || [] );
        });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['personnels']) {
      this.dataSource = new MatTableDataSource<TypePersonnel>(
        changes['personnels'].currentValue
      );
      this.dataSource.paginator = this.paginator;
    }
  }


  monTest() {
    let correspondance: TypeFormatJSON<IApiPerson, IPerson>['correspondance'] =
      { name: 'nom', prename: 'prenom', sex: 'sexe', profes: 'profession' };
    let apiFormat = formatJSON<IApiPerson, IPerson>({
      obj: apiPerson,
      correspondance: correspondance,
    });

    console.log(
      "transformation de l'api recu de ",
      apiPerson,
      'vers ',
      apiFormat
    );
  }
}

// export function maValidation(
//   control: AbstractControl
// ): ValidationErrors | null {
//   const valeur = control.value;

//   if (valeur && valeur.length > 10) {
//     return { monValidation: true };
//   }

//   return null;
// }
