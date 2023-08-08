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

type Ferier = { jour: string; type: 'ouvrable' | 'non ouvrable' | 'simple' };

export type DataPlanning = {
  periode: number | string;
  feriers: Ferier[];
  superviseur: string[];
};

@Component({
  selector: 'app-modal-planification',
  templateUrl: './modal-planification.component.html',
  styleUrls: ['./modal-planification.component.scss'],
})
export class ModalPlanificationComponent implements OnInit {
  @Output() openChange: EventEmitter<boolean> = new EventEmitter();
  @Output() dataEmit: EventEmitter<DataPlanning> = new EventEmitter();
  public superviseur: string[] = ['', '', ''];
  private _periode: number = 3;
  public arrayNumPeriode: number[] = [1, 2, 3];
  public feriers: Ferier[] = [];


  private _options!:TypePersonnel[];
  public controlSuperviseur = new FormControl<string | TypePersonnel>("");
  public filteredOptions$!:Observable<TypePersonnel[]>

  // public numberFerier:number[] = [1];
  // public tailleFerier:number = this.ferier.length;

  constructor(private api:ApiService) {}


  ngOnInit(): void {

    this.api.getAllData<IApiPersonnel[]>({for:"personnels"}).subscribe((subs)=>{
      let transSubs = mapJSON<IApiPersonnel, IPersonnel>(subs, mapPersonnel);
      this.options = transSubs;

    });

  }

  set options (value:TypePersonnel[]){
    this._options = value;
    this.filteredOptions$ = this.controlSuperviseur.valueChanges.pipe(
      startWith(""),
      map(value => {
        let name = ""
        if(typeof value =="string"){

           name = value 

        }else if(value) {
          let unkOption : string = value.nom as string
          name = unkOption;
        }
        return name ? this._filter(name as string).slice(0, 5) : this.options.slice(0, 5);
      }),
    )
  }

  get options(){
    return this._options;
  }

  @Input()
  set open(bool: boolean) {
    if (bool == false) {
      this.openChange.emit(false);
    }
  }

  displayFn(personnel:TypePersonnel):string{
    if(personnel){
      let unkName:string = personnel.nom as string;
      return unkName
    }
    return ""
  }

  private _filter(name:string):TypePersonnel[]{
    const filterValue = name.toLowerCase();
    return this.options.filter(option =>{
      let unkOption : string = option.nom as any
      return unkOption.toLowerCase().includes(filterValue)
    });
  }

  public set periode(n: number | string) {
    if (typeof n == 'string') {
      this._periode = +n;
    } else this._periode = n;
    this.arrayNumPeriode = Array.from(
      { length: this._periode },
      (_, index) => index
    );
  }

  public get periode() {
    return this._periode;
  }

  public ajoutFerier() {
    this.feriers.push({ jour: '', type: 'simple' });
    // this.numberFerier = Array.from({ length: this.ferier.length }, (_, index) => index + 1);
  }

  public suprFerier(i: number) {
    this.feriers.splice(i, 1);
    // this.numberFerier = Array.from({ length: this.ferier.length }, (_, index) => index + 1);
  }

  public generer() {
    let data = {
      periode: this.periode,
      feriers: this.feriers,
      superviseur: this.superviseur,
    };
    this.dataEmit.emit(data);
    this.openChange.emit(false);
  }
}
