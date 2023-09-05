import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { LoaderService } from '../../services/loader.service';
import { IApiHoliday } from '../../interfaces/iapiholiday';
import { filterPersonnelRessource, stringDate } from '../../utils/function';
import { IApiPersonnel } from '../../interfaces/iapipersonnel';
import axios from 'axios';

@Component({
  selector: 'app-modal-absence',
  templateUrl: './modal-absence.component.html',
  styleUrls: [
    './modal-absence.component.scss',
    '../../styles/modal-absence.scss',
  ],
})
export class ModalAbsenceComponent implements OnInit {
  @Input() open: boolean = false;
  @Output() openChange: EventEmitter<boolean> = new EventEmitter();

  @Input() resetPlanning:boolean = false;
  @Output() resetPlanningChange:EventEmitter<boolean> = new EventEmitter()

  @Input() resetPersonnel:boolean = false;
  @Output() resetPersonnelChange:EventEmitter<boolean> = new EventEmitter()

  public absenceForm!: FormGroup;
  public options!: IApiPersonnel[];


  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private userAuth: AuthService,
    private alert: AlertService,
    private loader: LoaderService
  ) {}


  ngOnInit(): void {
    this.absenceForm = this.formBuilder.group({
      type: ['CONGE', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      submissionDate: [''],
      message: [''],
      personnel: [''],
    });

    let existPersonnel = false;
    let dataPersonnel = this.api.data.personnels;
    if(dataPersonnel && dataPersonnel.length){
      this.options = filterPersonnelRessource(dataPersonnel);
      existPersonnel = true
    }

    this.api.personnels$.subscribe((subs)=>{
      this.options = filterPersonnelRessource(subs);
    })

    if(!existPersonnel){

      this.api
        .getAllData<IApiPersonnel[]>({ for: 'personnels' })
        .subscribe((subs) => {
          this.api.data.personnels = subs || [];
          this.api.personnels$.next(subs || [])
        });
    }
  }

  up() {
    let headerModal = document.querySelectorAll('.see-modal-absence');
    for (let i = 0; i < headerModal.length; i++) {
      let elemt = headerModal[i];
      elemt.classList.add('anim-slideOut-s');
    }
    setTimeout(() => {
      this.openChange.emit(false);
    }, 400);
  }

  isValidForm(): boolean {
    let isValid = true;
    if (
      !this.absenceForm.get('personnel')?.value ||
      typeof this.absenceForm.get('personnel')?.value == 'string' ||
      !this.absenceForm.valid
    ) {
      isValid = false;
    }
    return isValid;
  }

  async postAbsence() {
    this.loader.loader_modal$.next(true)
    let data: IApiHoliday = this.absenceForm.value;
    data.submissionDate = stringDate(new Date());
    try{

      let resp = await axios.post(this.api.URL_ABSENCES, data);
      if(resp.data.id){
        this.up()
        this.resetPersonnelChange.emit(true);
        this.alert.alertMaterial({"message":"Sauvegarde de l'absence réussi", "title":"success"});
        this.api.data.personnels = [];
      }
    }catch(e){
      console.error("Voici l'erreur", e);
      this.alert.alertMaterial({"message":"Erreur lors de l'enregistrement", "title":"error"});
    }

    console.log("données formulaire", data)
    this.loader.loader_modal$.next(false)
  }

  receivePersonnel(event: IApiPersonnel | string | null) {
    this.absenceForm.get('personnel')?.setValue(event);
  }
}
