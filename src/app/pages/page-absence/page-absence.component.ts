import { Component, OnInit } from '@angular/core';
import { IAbsence } from 'src/app/shared/interfaces/iabsence';
import { AuthService } from 'src/app/shared/services/auth.service';
import { TypeAbsence } from 'src/app/shared/utils/types-map';

@Component({
  selector: 'app-page-absence',
  templateUrl: './page-absence.component.html',
  styleUrls: ['./page-absence.component.scss',"../shared/styles/styles.scss"]
})
export class PageAbsenceComponent implements OnInit {

  public tabAbsences: TypeAbsence[] | null = [];

  public closeAppModal2:boolean = true;

  constructor(private auth:AuthService) { }

  ngOnInit(): void {
    if (this.auth.user && this.auth.user.absences) {
      this.tabAbsences = this.auth.user.absences as TypeAbsence[];
    }
  }

}
