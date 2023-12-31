import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { IAbsence } from '../../interfaces/iabsence';
import { IPersonnel } from '../../interfaces/ipersonnel';
import { TypeAbsence, TypePersonnel } from '../../utils/types-map';
import { IApiRemplacement } from '../../interfaces/iapiremplacement';
import { LoaderService } from '../../services/loader.service';
import { AlertService } from '../../services/alert.service';
import axios from 'axios';
import { ApiService } from '../../services/api.service';
import { IRole } from '../../interfaces/irole';
import { IApiPersonnel } from '../../interfaces/iapipersonnel';

//Tous les absences d'un utlisateur
@Component({
  selector: 'app-modal3',
  templateUrl: './modal3.component.html',
  styleUrls: ['./modal3.component.scss'],
})
export class Modal3Component implements OnInit, OnChanges {
  @Input() close: boolean = true;
  @Output() closeChange: EventEmitter<boolean> = new EventEmitter();

  @Input() tabs: IApiRemplacement[] | null = null;

  @Input() user! : IApiPersonnel;

  public _tabAbsences: IApiRemplacement[] | null = [];

  public tabRemplacement: IApiRemplacement[] | null = [];

  public authRoles: IRole['name'][] = [];

  public userAuthenticated!: TypePersonnel;

  constructor(
    private userAuth: AuthService,
    private loader: LoaderService,
    private alert: AlertService,
    private api: ApiService
  ) {}

  set tabAbsences(value: IApiRemplacement[] | null) {
    this._tabAbsences = value;
  }

  get tabAbsences() {
    return this._tabAbsences;
  }

  

  ngOnInit(): void {

    // if (
    //   this.userAuth.user &&
    //   this.userAuth.user.absentList &&
    //   this.userAuth.rolesName.includes('VALIDER REMPLACEMENT')
    // ) {
    //   this.tabAbsences = this.userAuth.user.absentList as TypeAbsence[];
    //   console.log("role", this.authRoles);
    // }

    if (this.userAuth.user) {
      this.userAuthenticated = this.userAuth.user;
    }

    this.authRoles = this.userAuth.rolesName;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tabs']) {
      this.tabAbsences = changes['tabs'].currentValue;
      console.log('tableau envoyé', this.tabAbsences);
    }
  }

  up() {
    this.closeChange.emit(true);
  }

  async validateAbsence(absence: IApiRemplacement, valBool: boolean) {
    this.loader.loader_modal$.next(true);
    let copyRemplacement: IApiRemplacement = JSON.parse(
      JSON.stringify(absence)
    );
    copyRemplacement.validate = valBool;
    // delete copyRemplacement.personnel;
    // delete copyRemplacement.remplaceur;
    try {
      let response = await axios.put(
        this.api.URL_REMPLACEMENTS + '/' + copyRemplacement.id,
        copyRemplacement
      );
      if (response.data.id) {
        absence.validate = valBool;
        this.alert.alertMaterial({
          message: 'Action enregistrer',
          title: 'success',
        });


      }
    } catch (e) {
      this.alert.alertMaterial({
        message: "une erreur s'est produite",
        title: 'error',
      });
      console.error('voici une erreur', e);
    }

    this.loader.loader_modal$.next(false);
  }
}
