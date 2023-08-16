import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAbsence } from '../../interfaces/iabsence';
import { TypeAbsence, TypePersonnel } from '../../utils/types-map';
import { IApiRemplacement } from '../../interfaces/iapiremplacement';
import { AuthService } from '../../services/auth.service';
import { IApiPersonnel } from '../../interfaces/iapipersonnel';
import { mapJSON } from '../../utils/function';
import { IPersonnel } from '../../interfaces/ipersonnel';
import { mapPersonnel } from '../../utils/tables-map';
import { AlertService } from '../../services/alert.service';
import { LoaderService } from '../../services/loader.service';
import axios from 'axios';

//formulaire pour la soumission des demandes d'absences

@Component({
  selector: 'app-modal2',
  templateUrl: './modal2.component.html',
  styleUrls: ['./modal2.component.scss'],
})
export class Modal2Component implements OnInit {
  @Input() close: boolean = true;
  @Input() tabAbsences: IApiRemplacement[] | null = null;
  @Output() closeChange: EventEmitter<boolean> = new EventEmitter();

  public user!: TypePersonnel;
  public options!: TypePersonnel[];

  public absenceForm!: FormGroup;

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private userAuth: AuthService,
    private alert: AlertService,
    private loader: LoaderService
  ) {}

  ngOnInit(): void {
    this.api
      .getAllData<IApiPersonnel[]>({ for: 'personnels' })
      .subscribe((subs) => {
        let transSubs = subs;
        // let transSubs = mapJSON<IApiPersonnel, IPersonnel>(subs, mapPersonnel)
        this.options = transSubs;
      });

    if (this.userAuth.user) {
      this.user = this.userAuth.user;
    }
    this.absenceForm = this.formBuilder.group({
      motif: ['', Validators.required],
      start: ['', Validators.required],
      remplaceur: ['', Validators.required],
      submissionDate: [''],
      message: [''],
    });
  }

  up() {
    this.closeChange.emit(true);
  }

  async postAbsence() {
    this.loader.loader_modal$.next(true);
    console.log('données formulaire absence =>', this.absenceForm);
    let data: IApiRemplacement = this.absenceForm.value;
    let day = new Date().toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    data.submissionDate = day;

    let errors = false;
    if (!data.remplaceur || typeof data.remplaceur == 'string') {
      errors = true;
    }

    if (errors) {
      this.alert.alertFormulaire();
    } else {
      let copyPersonnel: IApiPersonnel = JSON.parse(
        JSON.stringify(this.userAuth.user)
      );
      delete copyPersonnel.personnels_jour;
      delete copyPersonnel.personnels_nuit;
      delete copyPersonnel.vacancies;
      delete copyPersonnel.departement;
      delete copyPersonnel.absentList;
      data.personnel = copyPersonnel;

      try {
        let response = await axios.post(this.api.URL_REMPLACEMENTS, data);

        if (response.data.id) {
          data.id = response.data.id;

          this.tabAbsences?.unshift(data);
          this.up();
          
          this.alert.alertMaterial({
            message: 'Enregistrement de remplacement réussi',
            title: 'success',
          });
        }
      } catch (e) {
        console.error("voici l'erreur", e);
        this.alert.alertMaterial({
          message: "Une erreur s'est produite",
          title: 'error',
        });
      }
    }

    this.loader.loader_modal$.next(false);

    // this.tabAbsences?.unshift(data);
    // this.up();

    //   this.api
    //     .postData<IApiRemplacement>(
    //       this.api.URL_POST_ABSENCES + this.user.userId,
    //       data
    //     )
    //     .subscribe((subs) => {
    //       if (subs) {
    //         console.log("Insertion d'Absences réussi", subs)
    //         this.tabAbsences?.unshift(data);
    //         this.up();
    //       }else{
    //         console.log("Insertion d'Absences échoué")
    //       }
    //     });
    // }
  }

  receiveSuperviseur(event: TypePersonnel | string | null) {
    this.absenceForm.get('remplaceur')?.setValue(event);
  }
}
