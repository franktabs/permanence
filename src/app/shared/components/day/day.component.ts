import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Ferier } from '../modal-planification/modal-planification.component';
import { isEqualDate, stringDate } from '../../utils/function';
import { IPermanence } from '../../interfaces/ipermanence';

@Component({
  selector: 'app-day',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss'],
})
export class DayComponent implements OnInit, OnChanges {
  public typeFerier: IPermanence["type"] = 'simple';
  public ordinaire: boolean = true;
  @Input() permanences!:IPermanence[] ;
  @Input() date!: Date;
  @Input() feriers: Ferier[] = [];
  public permanence!:IPermanence;
  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['date']) {
      let newDate = changes['date'].currentValue;

      if (this.feriers.length) {
        for (let ferier of this.feriers) {
          let thisDate = new Date(ferier.jour);
          if (
            this.date &&
            isEqualDate(this.date, thisDate) &&
            (ferier.type == 'ouvrable' || ferier.type == 'non_ouvrable')
          ) {
            this.typeFerier = ferier.type;
            this.ordinaire = false;
            break;
          } else {
            this.ordinaire = true;
          }
        }
      }
      this.ordinaire =
      newDate.getDay() != 0 &&
      newDate.getDay() != 6 &&
      this.typeFerier == 'simple';
      if(this.permanence){
        this.permanence.date = stringDate(newDate);
        this.permanence.type = this.typeFerier
      }
    }

    if (changes['feriers']) {
      let currentFerier: Ferier[] = changes['feriers'].currentValue;
      for (let ferier of currentFerier) {
        let thisDate = new Date(ferier.jour);
        if (
          this.date &&
          isEqualDate(this.date, thisDate) &&
          (ferier.type == 'ouvrable' || ferier.type == 'non_ouvrable')
        ) {
          this.typeFerier = ferier.type;
          this.ordinaire = false;
          break;
        } else {
          this.ordinaire = true;
        }
      }
      if(this.date){
        this.ordinaire =
        this.date.getDay() != 0 &&
        this.date.getDay() != 6 &&
        this.typeFerier == 'simple';

        if(this.permanence){
          this.permanence.date = stringDate(this.date);
          this.permanence.type = this.typeFerier
        }
      }

    }
    if(changes["permanences"]){
      let perm = changes["permanences"].currentValue
      this.permanences = perm;
      this.permanence = {date:stringDate(this.date)||"", type:"simple", personnels_jour:[], personnels_nuit:[]}
      this.permanences.push(this.permanence)
    }
  }
}
