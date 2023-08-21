import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-modal-absence',
  templateUrl: './modal-absence.component.html',
  styleUrls: ['./modal-absence.component.scss', '../../styles/modal-absence.scss']
})
export class ModalAbsenceComponent implements OnInit {

  @Input() open:boolean = false;
  @Output() openChange: EventEmitter<boolean> = new EventEmitter();



  public absenceForm!: FormGroup;


  constructor(    private api: ApiService,
    private formBuilder: FormBuilder,
    private userAuth: AuthService,
    private alert: AlertService,
    private loader: LoaderService) { }

  ngOnInit(): void {

    this.absenceForm = this.formBuilder.group({
      type: ['CONGE', Validators.required],
      start: ['', Validators.required],
      end: ['', Validators.required],
      submissionDate: [''],
      message: [''],
    });
  }

  up(){
    let headerModal = document.querySelectorAll('.see-modal-absence');
    for (let i = 0; i < headerModal.length; i++) {
      let elemt = headerModal[i];
      elemt.classList.add('anim-slideOut-s');
    }
    setTimeout(() => {
      this.openChange.emit(false);
    }, 400);
  }


  postAbsence(){
    let data = this.absenceForm.value;

    console.log("Données du formulaire", data)
  }

}
