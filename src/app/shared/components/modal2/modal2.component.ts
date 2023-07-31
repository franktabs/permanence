import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IAbsence } from '../../interfaces/iabsence';

@Component({
  selector: 'app-modal2',
  templateUrl: './modal2.component.html',
  styleUrls: ['./modal2.component.scss']
})
export class Modal2Component implements OnInit {

  @Input() close:boolean = true;
  @Output() closeChange:EventEmitter<boolean> = new EventEmitter()

  public absenceForm!:FormGroup;


  constructor(private api:ApiService, private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.absenceForm = this.formBuilder.group({
      "motif":["", Validators.required],
      "debut":["", Validators.required],
      "fin":["", Validators.required],
      "date":["", Validators.required],
      "commentaire":["", Validators.required]

    }) 
  }

  up(){
    this.closeChange.emit(true)
  }

  postAbsence(){
    console.log("données formulaire absence =>",this.absenceForm)
  }

}
