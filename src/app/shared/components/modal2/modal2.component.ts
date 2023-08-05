import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAbsence } from '../../interfaces/iabsence';
import { TypeAbsence } from '../../utils/types-map';
import { IApiAbsence } from '../../interfaces/iapiabsence';

//formulaire pour la soumission des demandes d'absences

@Component({
  selector: 'app-modal2',
  templateUrl: './modal2.component.html',
  styleUrls: ['./modal2.component.scss']
})
export class Modal2Component implements OnInit {

  @Input() close:boolean = true;
  @Input() tabAbsences:IApiAbsence[]|null = null;
  @Output() closeChange:EventEmitter<boolean> = new EventEmitter()

  public absenceForm!:FormGroup;


  constructor(private api:ApiService, private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.absenceForm = this.formBuilder.group({
      "motif":["", Validators.required],
      "start":["", Validators.required],
      "end":["", Validators.required],
      "submissionDate":[""],
      "message":[""]
    }) 
  }

  up(){
    this.closeChange.emit(true)
  }

  postAbsence(){
    console.log("données formulaire absence =>",this.absenceForm)
    let data:IApiAbsence = this.absenceForm.value;
    let day = new Date().toLocaleDateString("en-CA", {year:"numeric", month:"2-digit", day:"2-digit"});
    data.submissionDate = day;

    this.api.postAbsence(data)
    this.tabAbsences?.unshift(data)
    this.up()
  }

}