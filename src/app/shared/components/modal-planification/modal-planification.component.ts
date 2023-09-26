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
import {
  filterOffAdmin,
  mapJSON,
  separatePersonnel,
  separatePersonnelTFJ,
} from '../../utils/function';
import { IPersonnel } from '../../interfaces/ipersonnel';
import { mapPersonnel } from '../../utils/tables-map';
import { IPermanence } from '../../interfaces/ipermanence';
import { LoaderService } from '../../services/loader.service';
import { AlertService } from '../../services/alert.service';
import IGroupe from '../../interfaces/igroupe';
import { CRITERE_OBJECT } from '../modal-input/modal-input.component';
import { RepartitionSemaine } from 'src/app/pages/page-plannification/page-plannification.component';

export type Ferier = { jour: string; type: IPermanence['type'] };

export type DataPlanning = {
  periode: number | string;
  feriers: Ferier[];
  superviseur: IApiPersonnel[]
  group1: Array<string | TypePersonnel>;
  repartition:RepartitionSemaine;
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
  public groupes: IGroupe[] = [];


  public repartitionSemaine:RepartitionSemaine = {semaine:4, samediJour:4, samediNuit:2, dimancheJour:4, dimancheNuit:2}

  public optionsManager: TypePersonnel[] = [];
  public optionsRessources: TypePersonnel[] = [];
  public controlSuperviseur = new FormControl<string | TypePersonnel>('');
  public filteredOptions$!: Observable<TypePersonnel[]>;
  public responsableTFJ: Array<string | IApiPersonnel> = Array.of(
    '',
    '',
    '',
    '',
    ''
  );
  public arrayNumResponsableTFJ = Array.from(
    { length: this.responsableTFJ.length },
    (_, index) => index
  );

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
        if (subs)
          separatePersonnelTFJ(
            subs,
            this.optionsManager,
            this.optionsRessources
          );
      });

    this.groupes = this.api.data.groupes;
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

  // public isDisabled(){
  //   let errors = false;
  //   for (let i = 0; i < +this.periode; i++) {
  //     let person = this.superviseur[i];
  //     if (!person || typeof person == 'string') {
  //       return errors = true;
  //     }
  //   }

  //   let existResponsable:number[] = [];

  //   for(let responsable of this.responsableTFJ){
  //     if(!responsable || typeof responsable == "string"){
  //       return errors = true;
  //     }else{
  //       if(responsable.id && existResponsable.includes(responsable.id)){
  //         return errors = true;
  //       }
  //       else if(responsable.id) {
  //         existResponsable.push(responsable.id);
  //       }
  //     }
  //   }

  //   for (let ferier of this.feriers) {
  //     if (!ferier.jour) {
  //       return errors = true;
  //     }
  //   }
  //   return errors;
  // }

  public isDisabled(): boolean {
    for (let ferier of this.feriers) {
      if (!ferier.jour) {
        console.log("problème de ferier")
        return true;
      }
    }

    if(this.api.data.groupes.length < 3){
      console.log("problème moins de 3 groupes")

      return true;
    }

    let criteresGroupes:Set<keyof typeof CRITERE_OBJECT> = new Set();
    
    for(let group of this.api.data.groupes){
      if(!group.personnels.size || !group.criteres.length){
        console.log("problème vide personnel ou critere")
        return true;
      }
      for(let critere of group.criteres){
        criteresGroupes.add(critere.nom);
        if(critere.nom=="RESPONSABLE TFG" && group.personnels.size<5){
          console.log("problème tfg < 5")
          return true;
        }
        else if(critere.nom=="SUPERVISEUR" && (+this.periode)>group.personnels.size ){
          console.log("problème superviseur < a la periode")
          return true;
        }
      }
    }
    if(!criteresGroupes.has("SUPERVISEUR")){
      console.log("problème aucun superviseur")
      return true;
    }
    if(!criteresGroupes.has("RESPONSABLE TFG")){
      console.log("problème aucun responsable")

      return true;
    }
  

    return false;
  }

  // public generer() {
  //   this.loader.loader_modal$.next(true);
  //   let data: DataPlanning = {
  //     periode: this.periode,
  //     feriers: this.feriers,
  //     superviseur: this.superviseur,
  //     group1: this.responsableTFJ,
  //   };
  //   let errors = false;
  //   for (let i = 0; i < +this.periode; i++) {
  //     let person = this.superviseur[i];
  //     if (!person || typeof person == 'string') {
  //       errors = true;
  //       break;
  //     }
  //   }

  //   for (let responsable of this.responsableTFJ) {
  //     if (!responsable || typeof responsable == 'string') {
  //       errors = true;
  //       break;
  //     }
  //   }

  //   for (let ferier of this.feriers) {
  //     if (!ferier.jour) {
  //       errors = true;
  //       break;
  //     }
  //   }
  //   if (errors) {
  //     this.loader.loader_modal$.next(false);
  //     this.alert.alertFormulaire();
  //   } else {
  //     console.log('données config planning', data);
  //     this.dataEmit.emit(data);
  //     this.openChange.emit(false);
  //   }
  //   this.loader.loader_modal$.next(false);
  // }
  public generer() {

    let superviseur:DataPlanning["superviseur"]= [];
    for(let group of this.groupes){
      for(let critere of group.criteres){
        if(critere.nom=="SUPERVISEUR"){
          for(let person of group.personnels){
            superviseur.push(person);
          }
        }
      }
    }

    let data: DataPlanning = {
      periode: this.periode,
      feriers: this.feriers,
      superviseur: superviseur,
      group1: this.responsableTFJ,
      repartition:this.repartitionSemaine
    };
    // let errors = false;
    // for (let i = 0; i < +this.periode; i++) {
    //   let person = this.superviseur[i];
    //   if (!person || typeof person == 'string') {
    //     errors = true;
    //     break;
    //   }
    // }

    // for (let responsable of this.responsableTFJ) {
    //   if (!responsable || typeof responsable == 'string') {
    //     errors = true;
    //     break;
    //   }
    // }

    // for (let ferier of this.feriers) {
    //   if (!ferier.jour) {
    //     errors = true;
    //     break;
    //   }
    // }
    // if (errors) {
    //   this.loader.loader_modal$.next(false);
    //   this.alert.alertFormulaire();
    // } else {
    //   console.log('données config planning', data);
    //   this.dataEmit.emit(data);
    //   this.openChange.emit(false);
    // }
    this.dataEmit.emit(data);
    this.openChange.emit(false);
  }

  public receiveSuperviseur(i: number, event: any) {
    this.superviseur[i - 1] = event;
  }

  public receiveResponsable(i: number, event: any) {
    console.log('position ', i);
    this.responsableTFJ[i] = event;
  }

  public ajouterGroupe() {
    let newGroup: IGroupe = { nom: 'Groupe', criteres: [], personnels: new Set() };
    this.groupes.push(newGroup);
  }

  suprGroupe(index: number) {
    this.groupes.splice(index, 1);
  }

  completePersonnel(group:IGroupe, value:boolean){
    this.loader.loader_modal$.next(true)
    console.log("execution de complete reste personnel")
    if(value==true){
      let idPersonnels:number[] = []
      this.groupes.forEach((oneGroup)=>{
        for(let person of oneGroup.personnels){
          if(person.id){
            idPersonnels.push(person.id);
          }
        }
      })
      let datasPersonnel = this.api.data.personnels;
      for(let person of datasPersonnel){
        if(person.id && !idPersonnels.includes(person.id)){
          group.personnels.add(person);
        }
      }
    }
    this.loader.loader_modal$.next(false)

  }
}
