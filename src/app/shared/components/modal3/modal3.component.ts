import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { IAbsence } from '../../interfaces/iabsence';

@Component({
  selector: 'app-modal3',
  templateUrl: './modal3.component.html',
  styleUrls: ['./modal3.component.scss']
})
export class Modal3Component implements OnInit {

  @Input() close:boolean = true;
  @Output() closeChange:EventEmitter<boolean> = new EventEmitter() 
  
  public tabAbsences:IAbsence[] | null = []

  constructor(private userAuth:AuthService) { }

  ngOnInit(): void {
    if(this.userAuth.user && this.userAuth.user.absences){
      this.tabAbsences = this.userAuth.user.absences;
    }
  }

  up(){
    this.closeChange.emit(true)
  }

}
