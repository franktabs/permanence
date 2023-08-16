import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { IPlanning } from '../../interfaces/iplanning';
import { IPermanence } from '../../interfaces/ipermanence';
import { ApiService } from '../../services/api.service';
import { concatMap, from, map, of } from 'rxjs';
import { IMonth } from '../../interfaces/imonth';
import axios from 'axios';
import { LoaderService } from '../../services/loader.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-card-planning',
  templateUrl: './card-planning.component.html',
  styleUrls: ['./card-planning.component.scss'],
})
export class CardPlanningComponent implements OnInit, OnChanges {
  @Input() plannings: IPlanning[] = [];
  @Input() indice!: number;

  public planning!: IPlanning;

  @Output() planningEmit: EventEmitter<IPlanning> = new EventEmitter();

  constructor(
    private api: ApiService,
    private loader: LoaderService,
    private alert: AlertService
  ) {}

  ngOnInit(): void {}

  handleClick() {
    this.planningEmit.emit(this.planning);
  }

  async handleSave() {
    this.loader.loader_modal$.next(true);

    let planningCopy = JSON.parse(JSON.stringify(this.planning));
    let monthsCopy: IMonth[] | undefined = this.planning.months;
    let permanences = null;
    let personnels_jours = null;
    let personnels_nuits = null;
    let idPlanning: number | null = null;
    delete planningCopy.months;
    let i = 0;
    let n = 0;
    console.log('monthsCopy', monthsCopy);
    console.log('month original', this.planning.months);
    // debugger
    try {
      let response = await axios.post(this.api.URL_PLANNINGS, planningCopy);
      console.log('sauvegarde de planning', response.data);
      if (response.data.id) {
        idPlanning = response.data.id;
        if (monthsCopy)
          for (let month of monthsCopy) {
            if (month.planning) {
              month.planning.id = idPlanning as number;
            }
            permanences = month.permanences;
            let copy2Month = JSON.parse(JSON.stringify(month));
            delete copy2Month.permanences;
            response = await axios.post(this.api.URL_MONTHS, copy2Month);
            console.log('sauvegarde de mois', response.data);
            if (response.data.id) {
              let idMonth: number = response.data.id;
              month.id = idMonth;
              if (permanences) {
                for (let permanence of permanences) {
                  if (permanence.month) permanence.month.id = idMonth;
                  personnels_jours = permanence.personnels_jour;
                  personnels_nuits = permanence.personnels_nuit;
                  let copyPermanence = JSON.parse(JSON.stringify(permanence))
                  delete copyPermanence.personnels_jour;
                  delete copyPermanence.personnels_nuit;
                  response = await axios.post(
                    this.api.URL_PERMANENCES,
                    copyPermanence
                  );
                  console.log('sauvegarde de permanence', response.data);
                  // debugger
                  if (response.data.id) {
                    let idPermanence: number = response.data.id;
                    permanence.id = idPermanence;
                    if (personnels_jours) {
                      for (let personnel_jour of personnels_jours) {
                        if (personnel_jour.permanence)
                          personnel_jour.permanence.id = idPermanence;
                        response = await axios.post(
                          this.api.URL_PERSONNEL_JOURS,
                          personnel_jour
                        );
                        console.log(
                          'sauvegarde de personnel_jour',
                          response.data
                        );
                        // debugger
                      }
                    }
                    if (personnels_nuits) {
                      for (let personnel_nuit of personnels_nuits) {
                        if (personnel_nuit.permanence)
                          personnel_nuit.permanence.id = idPermanence;
                        response = await axios.post(
                          this.api.URL_PERSONNEL_NUITS,
                          personnel_nuit
                        );
                        console.log(
                          'sauvegarde de personnel_nuit',
                          response.data
                        );
                      }
                    }
                  }
                }
              }
            }
          }
        if (idPlanning) {
          this.planning.id = idPlanning;
        }
        this.alert.alertMaterial({
          title: 'success',
          message: 'Enregistrement effectué avec succès',
        });
      }
    } catch (e) {
      this.alert.alertMaterial({
        title: 'error',
        message: 'Erreur lors de la sauvegarde',
      });
      console.error('Voici les erreurs et difficulté', e);
    } finally {
      this.loader.loader_modal$.next(false);
    }

    // from([this.api.URL_PLANNINGS]).pipe(
    //   concatMap((url)=>{
    //     return this.api.postData<IPlanning>(url,planningCopy)
    //   }),
    //   concatMap((value)=>{
    //     if(value.id){
    //       console.log("Enregistrement Planning réussi");
    //       this.planning.id = value.id;
    //       if(monthsCopy){
    //         return monthsCopy
    //       }
    //       return of(null)
    //     }
    //     else{
    //       console.log("Enregistrement Planning échoué");
    //       return of(null)
    //     }
    //   }),
    //   concatMap((value)=>{
    //     if(value){
    //       return this.api.postData<IMonth>(this.api.URL_MONTHS, value)
    //     }
    //     return null
    //   })
    // )
    // this.api.postData<IPlanning>(this.api.URL_PLANNINGS, planningCopy).subscribe(
    //   (subs)=>{
    //     if(subs.id){
    //       console.log("Enregistrement Planning réussi");
    //       this.planning.id = subs.id;
    //       for(monthCopy)
    //     }
    //     else{
    //       console.log("Enregistrement Planning non réussi");
    //     }
    //   }
    // )
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['plannings']) {
      let currentValue: IPlanning[] = changes['plannings'].currentValue;
      if (this.indice) {
        this.planning = currentValue[this.indice];
      }
    }
    if (changes['indice']) {
      let currentValue: IPlanning = changes['indice'].currentValue;
      if (this.plannings) {
        this.planning = this.plannings[this.indice];
      }
    }
  }

  async decisionPlanning(value: boolean | null) {
    this.loader.loader_modal$.next(true);
    let planningCopy: IPlanning = JSON.parse(JSON.stringify(this.planning));
    delete planningCopy.months;
    planningCopy.isValid = true;
    try {
      let response = await axios.post(this.api.URL_PLANNINGS, planningCopy);
      if (response.data.id) {
        this.planning.isValid = value;
        this.alert.alertMaterial({ title: 'success', message: 'Bien executé' });
      }
    } catch (e) {
      this.alert.alertMaterial({
        title: 'error',
        message: "Une erreur s'est produite",
      });
      console.error('Voici une erreur', e);
    }
    this.loader.loader_modal$.next(false);
  }

  remove() {
    this.plannings.splice(this.indice, 1);
  }
}
