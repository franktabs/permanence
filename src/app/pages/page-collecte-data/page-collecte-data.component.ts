import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, map, takeUntil, tap } from 'rxjs';
import {
  OuputTypeCard1,
  TitleCard1,
} from 'src/app/shared/components/card1/card1.component';
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
  scrollToDiv,
} from 'src/app/shared/utils/function';
import { mapDirection, mapPersonnel } from 'src/app/shared/utils/tables-map';
import { TypeDirection, TypePersonnel } from 'src/app/shared/utils/types-map';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
  DataDialogModalFormModelComponent,
  ModalFormModelComponent,
  TitleModalForm,
} from 'src/app/shared/components/modal-form-model/modal-form-model.component';
import { OptionalKey, OptionalKeyString } from 'src/app/shared/utils/type';
import axios, { AxiosResponse } from 'axios';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { HandleActionTable1 } from 'src/app/shared/components/table1/table1.component';
import {
  DataModalConfirm,
  ModalConfirmComponent,
} from 'src/app/shared/components/modal-confirm/modal-confirm.component';
import { IApiDepartement } from 'src/app/shared/interfaces/iapidepartement';
import DepartementRequest from 'src/app/shared/models/model-request/DepartementRequest';
import DirectionRequest from 'src/app/shared/models/model-request/DirectionRequest';

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
  public data_apiDepartements: IApiDepartement[] = [];
  public allPersonnels: TypePersonnel[] | null = null;
  public allUsers: TypePersonnel[] | null = null;
  public isTableFilter: boolean = false;
  public userAuth!: TypePersonnel | null;
  public destroy$!: Subject<boolean>;

  public dataSource: MatTableDataSource<TypePersonnel> =
    new MatTableDataSource<TypePersonnel>([]);

  public search: string = '';
  public searchDepartement: string = '';
  public searchDirection: string = '';

  private _paginator!: MatPaginator;

  @ViewChild(MatPaginator, { static: false })
  set paginator(value: MatPaginator) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }

  get paginator() {
    return this._paginator;
  }

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private dialog: MatDialog,
    private loader: LoaderService,
    private alert: AlertService
  ) {}

  public set data_apiPersonnels(value: TypePersonnel[] | null) {
    this._data_apiPersonnels = value;

    if (this._data_apiPersonnels && this.allPersonnels) {
      this.dataSource.data = this._data_apiPersonnels;
      this.dataSource.paginator = this.paginator;
      console.log('DataSource =>', this.dataSource.data);
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
        let unkHolidays: IApiHoliday[] = items.vacancies as any;
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
        let unkAbsences: IApiRemplacement[] = items.absentList as any;
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
    scrollToDiv('body');

    this.monTest();
    this.userAuth = this.auth.user;
    this.destroy$ = new Subject();
    console.log(this.date1Conge, this.date2Conge);
    this.toTable1.icon = "<i class='bi bi-person-lines-fill' ></i>";
    this.toTable1.title = 'Personnel';

    let existPersonnel = false;

    if (this.api.data['personnels'] && this.api.data.personnels.length) {
      existPersonnel = true;
      let allUserPersonnel = this.api.data.personnels;
      this.allPersonnels = allUserPersonnel;
      this.data_apiPersonnels = allUserPersonnel;
      this.allUsers = allUserPersonnel;
    }

    this.api.personnels$.pipe(takeUntil(this.destroy$)).subscribe((subs) => {
      this.api.data['personnels'] = subs;
      let allUserPersonnel = subs;
      this.allPersonnels = allUserPersonnel;
      this.data_apiPersonnels = allUserPersonnel;
      this.allUsers = allUserPersonnel;
    });

    if (this.api.data.directions && this.api.data.directions.length) {
      this.data_apiDirections = this.api.data.directions;
      this.buildDepartement();
    }

    this.api.directions$.pipe(takeUntil(this.destroy$)).subscribe((subs) => {
      this.data_apiDirections = subs;
      this.buildDepartement();
    });

    if (!(this.api.data.directions && this.api.data.directions.length)) {
      this.api
        .getAllData<IApiDirection[]>({ for: 'directions' })
        .pipe(takeUntil(this.destroy$))
        .subscribe((obs) => {
          this.data_apiDirections = obs || [];
          this.api.data.directions = this.data_apiDirections;
          this.buildDepartement();
        });
    }

    if (!existPersonnel) {
      this.api
        .getAllData<IApiPersonnel[]>({ for: 'personnels' })
        .pipe(takeUntil(this.destroy$))
        .subscribe((subs) => {
          // let dataMap = mapJSON<IApiPersonnel, IPersonnel>(obs, mapPersonnel)
          this.api.data.personnels = subs || [];
          this.api.personnels$.next(subs || []);
        });
    }
  }

  buildDepartement() {
    if (this.data_apiDirections && this.data_apiDirections.length) {
      this.data_apiDepartements = [];
      for (let direction of this.data_apiDirections) {
        if (direction.departements != null) {
          for (let departement of direction.departements) {
            departement.direction = direction;
            this.data_apiDepartements.push(departement);
          }
        }
      }
      this.api.data.departements = this.data_apiDepartements;
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

  async handleModel(attr: HandleActionTable1) {
    if (attr.titre == 'PERSONNEL' && attr.action == 'ADD') {
      this.loader.loader_modal$.next(true);
      try {
        let response = await axios.get(this.api.URL_PERSONNELS + '/min-userId');
        if (response.data) {
          let personnelMinUserId: IApiPersonnel = response.data;
          let minUserId = personnelMinUserId.userId;
          if (minUserId >= 0) {
            minUserId = -1;
          } else {
            minUserId -= 1;
          }

          let newPerson: OptionalKeyString<IApiPersonnel> = {
            firstname: '',
            sexe: 'M',
            emailaddress: '',
            organizationId: undefined,
            userId: minUserId,
          };
          console.log('nouvelle personne ', newPerson);
          this.dialog.open<
            ModalFormModelComponent,
            DataDialogModalFormModelComponent
          >(ModalFormModelComponent, {
            data: {
              titre: attr.titre,
              dataForm: newPerson,
              dataModelInput:newPerson,
              icon: "<i class='bi bi-person-fill-add'></i>",
              action: 'ADD',
            },
          });
        }
      } catch (e) {
        console.error("voici l'erreur ", e);
        this.alert.alertError();
      }

      this.loader.loader_modal$.next(false);
    } else if (
      attr.titre == 'PERSONNEL' &&
      attr.action == 'UPDATE' &&
      attr.row
    ) {
      let attr2: {
        titre: string | null;
        action: string | null;
        row: IApiPersonnel;
      } = attr as any;
      let person: OptionalKeyString<IApiPersonnel> = {
        firstname: attr2.row.firstname,
        sexe: attr2.row.sexe,
        emailaddress: attr2.row.emailaddress,
        organizationId: attr2.row.organizationId,
        userId: attr2.row.userId,
      };

      this.dialog.open<
        ModalFormModelComponent,
        DataDialogModalFormModelComponent
      >(ModalFormModelComponent, {
        data: {
          titre: attr.titre,
          dataForm: attr2.row,
          dataModelInput:person,
          icon: "<i class='bi bi-person-fill-add'></i>",
          action: 'UPDATE',
        },
      });
    } else if (
      attr.titre == 'PERSONNEL' &&
      attr.action == 'REMOVE' &&
      attr.row
    ) {
      let dialogRef = this.dialog.open<ModalConfirmComponent, DataModalConfirm>(
        ModalConfirmComponent,
        {
          data: {
            title: 'Confirmation de Suppression',
            content: 'Etes-vous sûre ?',
          },
        }
      );
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe((subs) => {
          if (subs == true) {
            this.suppression(attr);
          }
        });
    }
    if (attr.titre == 'DEPARTEMENT' && attr.action == 'ADD') {
      this.loader.loader_modal$.next(true);

      try {
        let response = await axios.get(
          this.api.URL_DEPARTEMENTS + '/min-organizationId'
        );
        if (response.data) {
          let departement: IApiDepartement = response.data;
          let minOrganizationId: number = departement.organizationId as any;

          if (minOrganizationId >= 0) {
            minOrganizationId = -1;
          } else {
            minOrganizationId -= 1;
          }
          let newDepartement: OptionalKeyString<IApiDepartement> = {
            name: '',
            parentorganizationId: undefined,
            organizationId: minOrganizationId,
          };
          this.dialog.open<
            ModalFormModelComponent,
            DataDialogModalFormModelComponent
          >(ModalFormModelComponent, {
            data: {
              titre: 'DEPARTEMENT',
              dataForm: newDepartement,
              dataModelInput:newDepartement,
              icon: "<i class='bi bi-building-add'></i>",
              departementRequest: new DepartementRequest([]),
              action: 'ADD',
            },
          });
        }
      } catch (e) {
        console.error("voici l'erreur ", e);
        this.alert.alertError();
      }

      this.loader.loader_modal$.next(false);
    } else if (
      attr.titre == 'DEPARTEMENT' &&
      attr.action == 'UPDATE' &&
      attr.row
    ) {
      let attr2: {
        titre: string | null;
        action: string | null;
        row: IApiDepartement;
      } = attr as any;

      let departementModel: OptionalKeyString<IApiDepartement> = {
        id:attr2.row.id,
        name: attr2.row.name,
        parentorganizationId:attr2.row.parentorganizationId,
        organizationId:attr2.row.organizationId
      };
      let departement = {...attr2.row}
      delete departement.direction;
      this.dialog.open<
        ModalFormModelComponent,
        DataDialogModalFormModelComponent
      >(ModalFormModelComponent, {
        data: {
          titre: attr.titre,
          dataForm: departement,
          dataModelInput:departementModel,
          icon: "<i class='bi bi-building-fill-add'></i>",
          action: 'UPDATE',
        },
      });
    } else if (
      attr.titre == 'DEPARTEMENT' &&
      attr.action == 'REMOVE' &&
      attr.row
    ) {
      let dialogRef = this.dialog.open<ModalConfirmComponent, DataModalConfirm>(
        ModalConfirmComponent,
        {
          data: {
            title: 'Confirmation de Suppression',
            content: 'Etes-vous sûre ?',
          },
        }
      );
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe((subs) => {
          if (subs == true) {
            this.suppression(attr);
          }
        });
    }

    if(attr.titre =="DIRECTION" && attr.action =="ADD"){
      
        this.loader.loader_modal$.next(true);
  
        try {
          let response = await axios.get(
            this.api.URL_DIRECTIONS + '/min-organizationId'
          );
          if (response.data) {
            let direction: IApiDirection = response.data;
            let minOrganizationId: number = direction.organizationId as any;
  
            if (minOrganizationId >= 0) {
              minOrganizationId = -1;
            } else {
              minOrganizationId -= 1;
            }
  
            let newDirection: OptionalKeyString<IApiDirection> = {
              name: '',
              organizationId: minOrganizationId,
            };
  
            this.dialog.open<
              ModalFormModelComponent,
              DataDialogModalFormModelComponent
            >(ModalFormModelComponent, {
              data: {
                titre: 'DIRECTION',
                dataForm: newDirection,
                dataModelInput:newDirection,
                icon: "<i class='bi bi-building-add'></i>",
                directionRequest: new DirectionRequest([]),
                action: 'ADD',
              },
            });
          }
        } catch (e) {
          console.error("voici l'erreur ", e);
          this.alert.alertError();
        }
  
        this.loader.loader_modal$.next(false);
      
    }
    else if(
      attr.titre == 'DIRECTION' &&
      attr.action == 'UPDATE' &&
      attr.row
    ){
      let attr2: {
        titre: string | null;
        action: string | null;
        row: IApiDirection;
      } = attr as any;

      let newDirection: OptionalKeyString<IApiDirection> = {
        name: attr2.row.name,
        organizationId: attr2.row.organizationId,
      };
      let direction = {...attr2.row}
      delete direction.departements;
      this.dialog.open<
        ModalFormModelComponent,
        DataDialogModalFormModelComponent
      >(ModalFormModelComponent, {
        data: {
          titre: attr.titre,
          dataForm: direction,
          dataModelInput:newDirection,
          icon: "<i class='bi bi-building-fill-add'></i>",
          action: 'UPDATE',
        },
      });
    }
    else if(
      attr.titre == 'DIRECTION' &&
      attr.action == 'REMOVE' &&
      attr.row
    ){
      let dialogRef = this.dialog.open<ModalConfirmComponent, DataModalConfirm>(
        ModalConfirmComponent,
        {
          data: {
            title: 'Confirmation de Suppression',
            content: 'Etes-vous sûre ?',
          },
        }
      );
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe((subs) => {
          if (subs == true) {
            this.suppression(attr);
          }
        });
    }
  }

  async suppression(attr: HandleActionTable1) {
    this.loader.loader_modal$.next(true);
    let attr2: {
      titre: string | null;
      action: string | null;
      row: { id: number };
    } = attr as any;

    try {
      if (attr2.row?.id != 0) {
        let response: AxiosResponse<any, any> | null = null;
        if (attr.titre == 'PERSONNEL') {
          response = await axios.delete(
            this.api.URL_PERSONNELS + '/' + attr2.row?.id
          );
        } else if (attr.titre == 'DEPARTEMENT') {
          response = await axios.delete(
            this.api.URL_DEPARTEMENTS + '/' + attr2.row?.id
          );
        } else if (attr.titre == 'DIRECTION') {
          response = await axios.delete(
            this.api.URL_DIRECTIONS + '/' + attr2.row?.id
          );
        }
        if (response && response.status <= 299 && response.status >= 200) {
          this.alert.alertMaterial({
            message: 'Suppression Réussi',
            title: 'success',
          });
          if(attr.titre == "PERSONNEL"){

            response = await axios.get(this.api.URL_PERSONNELS);
            if (response && response.data) {
              this.api.personnels$.next(response.data);
            }
          }else if(attr.titre=="DEPARTEMENT" || attr.titre=="DIRECTION"){
            response = await axios.get(this.api.URL_DIRECTIONS);
            if (response && response.data) {
              this.api.directions$.next(response.data);
            }
          }
        }
      } else {
        this.alert.alertMaterial({
          message: 'Impossible de supprimer cet utilisateur',
          title: 'error',
        });
      }
    } catch (e) {
      console.log("Voici l'erreur", e);
      this.alert.alertError();
    }
    this.loader.loader_modal$.next(false);
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
