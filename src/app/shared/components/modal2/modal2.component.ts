import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAbsence } from '../../interfaces/iabsence';
import { TypeAbsence, TypePersonnel } from '../../utils/types-map';
import { IApiRemplacement } from '../../interfaces/iapiremplacement';
import { AuthService } from '../../services/auth.service';

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

  public absenceForm!: FormGroup;

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private userAuth: AuthService
  ) {}

  ngOnInit(): void {
    if (this.userAuth.user) {
      this.user = this.userAuth.user;
    }
    this.absenceForm = this.formBuilder.group({
      motif: ['', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      submissionDate: [''],
      message: [''],
    });
  }

  up() {
    this.closeChange.emit(true);
  }

  postAbsence() {
    console.log('données formulaire absence =>', this.absenceForm);
    let data: IApiRemplacement = this.absenceForm.value;
    let day = new Date().toLocaleDateString('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    data.submissionDate = day;
    this.api
      .postData<IApiRemplacement>(
        this.api.URL_POST_ABSENCES + this.user.userId,
        data
      )
      .subscribe((subs) => {
        if (subs) {
          console.log("Insertion d'Absences réussi", subs)
          this.tabAbsences?.unshift(data);
          this.up();
        }else{
          console.log("Insertion d'Absences échoué")
        }
      });
  }
}
