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
import { AuthService } from '../../services/auth.service';
import { IRole, RoleType } from '../../interfaces/irole';
import { IAnnonce } from '../../interfaces/iannonce';
import { INotification } from '../../interfaces/inotification';

@Component({
  selector: 'app-card-planning',
  templateUrl: './card-planning.component.html',
  styleUrls: ['./card-planning.component.scss'],
})
export class CardPlanningComponent implements OnInit, OnChanges {
  @Input() plannings: IPlanning[] = [];
  @Input() indice!: number;

  public planning!: IPlanning;

  public authRoles: RoleType[] = [];

  @Input() typeDisplay: 'PERSON' | 'ALL' = 'ALL';

  public nbrAppartion: number = 0;

  @Output() planningEmit: EventEmitter<IPlanning> = new EventEmitter();

  constructor(
    private api: ApiService,
    private loader: LoaderService,
    private alert: AlertService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.authRoles = this.auth.rolesName;
  }

  ngAfterViewInit() {}

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
    let isValidPlanning = true;

    for (let monthCheck of this.planning.months || []) {
      for (let permanenceCheck of monthCheck.permanences || []) {
        let ensembleJour = new Set<number>();
        for (let personnelJourCheck of permanenceCheck.personnels_jour || []) {
          ensembleJour.add(personnelJourCheck.personnel.id || -1);
        }
        if (
          ensembleJour.size != (permanenceCheck.personnels_jour || []).length
        ) {
          isValidPlanning = false;
          this.loader.loader_modal$.next(false);

          return this.alert.alertMaterial(
            {
              title: 'error',
              message:
                'Une même personne ne peut être présente a la permanence ' +
                permanenceCheck.date,
            },
            7
          );
        }
        let ensembleNuit = new Set<number>();
        for (let personnelNuitCheck of permanenceCheck.personnels_nuit || []) {
          ensembleNuit.add(personnelNuitCheck.personnel.id || -1);
        }
        if (
          ensembleNuit.size != (permanenceCheck.personnels_nuit || []).length
        ) {
          isValidPlanning = false;
          this.loader.loader_modal$.next(false);

          return this.alert.alertMaterial(
            {
              title: 'error',
              message:
                'Une même personne ne peut être présente a la permanence ' +
                permanenceCheck.date,
            },
            7
          );
        }
      }
    }

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
                  let copyPermanence = JSON.parse(JSON.stringify(permanence));
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
          
          let annonce: IAnnonce = {
            type: 'VALIDATION PLANNING',
            message: 'planning enregistrer',
            submissionDate: new Date().toISOString(),
            emetteur: { id: this.auth.user?.id as number },
          };
          
          let response = await axios.post(this.api.URL_ANNONCES, annonce);
          if (response.data.id) {
            annonce = response.data;
            response = await axios.get(this.api.URL_ROLES + '/' + 2);
            if (response.data.id) {
              let roleValidation: IRole = response.data;
              let personnels = roleValidation.personnels;
              if (personnels)
                for (let personnel of personnels) {
                  let notification: INotification = {
                    annonce: { id: annonce.id as number },
                    recepteur: { id: personnel.id as number },
                    isViewed: null,
                    isDeleted: false,
                  };
                  response = await axios.post(
                    this.api.URL_NOTIFICATIONS,
                    notification
                  );
                  if (response.data.id) {
                    console.log('ajout de la notifications à ', personnel);
                  }
                }
            }
          }
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
      if (idPlanning) {
        axios
          .delete(this.api.URL_PLANNINGS + '/' + idPlanning)
          .then((res) => {
            this.alert.alertMaterial({
              title: 'information',
              message: "Retour à l'état précedent",
            });
          })
          .catch((e) => {
            console.error("Echec voici l'erreur", e);
            this.alert.alertMaterial({
              title: 'error',
              message: "Echec lors du retour à l'état précedent",
            });
          });
      }
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
        this.initNbrApparition();
      }
    }
    if (changes['indice']) {
      let currentValue: number = changes['indice'].currentValue;
      this.indice = currentValue;
      if (this.plannings) {
        this.planning = this.plannings[this.indice];
        this.initNbrApparition();
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

  initNbrApparition() {
    this.nbrAppartion = 0;
    if (this.planning && this.planning.months) {
      for (let month of this.planning.months) {
        if (month.permanences) {
          this.nbrAppartion += month.permanences.length;
        }
      }
    }
  }

  async remove() {
    this.loader.loader_modal$.next(true);
    if (this.planning.id) {
      try {
        let response = await axios.delete(
          this.api.URL_PLANNINGS + '/' + this.planning.id
        );
        if (response.status >= 200 && response.status < 300) {
          this.alert.alertMaterial({
            message: 'Suppression Réussi',
            title: 'success',
          });
          this.plannings.splice(this.indice, 1);
        }
      } catch (e) {
        console.error("voici l'erreur =>", e);
        this.alert.alertError();
      }
    }else{

      this.plannings.splice(this.indice, 1);
    }
    this.loader.loader_modal$.next(false);
  }
}
