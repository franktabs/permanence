import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Observable, Subject, map, startWith } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { TypePersonnel } from '../../utils/types-map';
import { FormControl } from '@angular/forms';
import { IApiPersonnel } from '../../interfaces/iapipersonnel';
import { mapJSON } from '../../utils/function';
import { IPersonnel } from '../../interfaces/ipersonnel';
import { mapPersonnel } from '../../utils/tables-map';
import { IPermanence } from '../../interfaces/ipermanence';
import { LoaderService } from '../../services/loader.service';
import { AlertService } from '../../services/alert.service';

export type Ferier = { jour: string; type: IPermanence['type'] };

export type DataPlanning = {
  periode: number | string;
  feriers: Ferier[];
  superviseur: string[] | TypePersonnel[] | null[];
};

@Component({
  selector: 'app-modal-planification',
  templateUrl: './modal-planification.component.html',
  styleUrls: ['./modal-planification.component.scss'],
})
export class ModalPlanificationComponent implements OnInit {
  @Output() openChange: EventEmitter<boolean> = new EventEmitter();
  @Output() dataEmit: EventEmitter<DataPlanning> = new EventEmitter();

  public superviseur: string[] | TypePersonnel[] | null[] = ['', '', ''];
  private _periode: number = 3;
  public arrayNumPeriode: number[] = [1, 2, 3];
  public feriers: Ferier[] = [];

  public options!: TypePersonnel[];
  public controlSuperviseur = new FormControl<string | TypePersonnel>('');
  public filteredOptions$!: Observable<TypePersonnel[]>;

  // public numberFerier:number[] = [1];
  // public tailleFerier:number = this.ferier.length;

  constructor(
    private api: ApiService,
    private loader: LoaderService,
    private alert: AlertService
  ) {}

  ngOnInit(): void {
    this.api
      .getAllData<IApiPersonnel[]>({ for: 'personnels' })
      .subscribe((subs) => {
        let transSubs = subs;
        // let transSubs = mapJSON<IApiPersonnel, IPersonnel>(subs, mapPersonnel);
        this.options = transSubs || [];
      });
  }

  @Input()
  set open(bool: boolean) {
    if (bool == false) {
      this.openChange.emit(false);
    }
  }

  public set periode(n: number | string) {
    if (typeof n == 'string') {
      this._periode = +n;
    } else this._periode = n;
    this.arrayNumPeriode = Array.from(
      { length: this._periode },
      (_, index) => index + 1
    );
  }

  public get periode() {
    return this._periode;
  }

  public ajoutFerier() {
    this.feriers.push({ jour: '', type: 'ouvrable' });
    // this.numberFerier = Array.from({ length: this.ferier.length }, (_, index) => index + 1);
  }

  public suprFerier(i: number) {
    this.feriers.splice(i, 1);
    // this.numberFerier = Array.from({ length: this.ferier.length }, (_, index) => index + 1);
  }

  public generer() {
    this.loader.loader_modal$.next(true); 
    let data = {
      periode: this.periode,
      feriers: this.feriers,
      superviseur: this.superviseur,
    };
    let errors = false;
    for (let i = 0; i < +this.periode; i++) {
      let person = this.superviseur[i];
      if (!person || typeof person == 'string') {
        errors = true;
        break;
      }
    }
    for (let ferier of this.feriers) {
      if (!ferier.jour) {
        errors = true;
        break;
      }
    }
    if (errors) {
      this.loader.loader_modal$.next(false);
      this.alert.alertFormulaire();
    } else {
      console.log('données config planning', data);
      this.dataEmit.emit(data);
      this.openChange.emit(false);
    }
    this.loader.loader_modal$.next(false);
  }

  public receiveSuperviseur(i: number, event: any) {
    this.superviseur[i - 1] = event;
  }
}
