import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { IPersonnel } from '../../interfaces/ipersonnel';
import { IHolidays } from '../../interfaces/iholidays';
import { IAbsence } from '../../interfaces/iabsence';
import { TypeAbsence, TypePersonnel } from '../../utils/types-map';



//modal utilisé pour afficher les informations sur une ressource
// provenant d'un click sur une ligne du tableau
@Component({
  selector: 'app-modal1',
  templateUrl: './modal1.component.html',
  styleUrls: ['./modal1.component.scss']
})
export class Modal1Component implements OnInit, OnChanges {

  @Input() isOpen!: boolean;

  @Output() isOpenChange: EventEmitter<boolean> = new EventEmitter()

  @Input() rows!: TypePersonnel | any;

  public closeModal3: boolean = true;

  public keyRow: Array<keyof TypePersonnel> = [];

  public keyRowHoliday: Array<keyof IHolidays> = [];

  public infoAbsence: { keys: Array<keyof TypeAbsence> | null, value: TypeAbsence | null } = { keys: null, value: null };

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rows']) {
      let obj = changes['rows'].currentValue;
      this.keyRow = Object.keys(obj).filter((item) => {
        if (typeof obj[item] == "string") {
          return true
        }
        return false
      }) as any;
      let obj1 = obj as TypePersonnel
      if (obj1.holidays && obj1.holidays.length) {
        this.keyRowHoliday = Object.keys(obj1.holidays[0]).filter((item) => {
          // console.log("who's undefined", obj.absence[item], obj.absence)
          let item1: keyof IHolidays = item as any
          if (obj1.holidays && obj1.holidays[0] && typeof obj1.holidays[0][item1] == "string") {
            return true
          }
          return false
        }) as any;
      }

      if (obj1.absences && obj1.absences.length) {
        let absence: TypeAbsence | null = null
        for (let oneAbsence of obj1.absences ) {
          let seconde = Math.floor((+new Date(oneAbsence.debut) - (+new Date())) / 1000);
          if (seconde > 0) {
            absence = oneAbsence as TypeAbsence;
            break;
          }
        }
        if (absence) {
          this.infoAbsence.value = absence;
          this.infoAbsence.keys = Object.keys(absence).filter((item) => {
            let item1: keyof TypeAbsence = item as any;
            if (absence && typeof absence[item1] == "string") {
              return true
            }
            return false
          }) as any;

        }
      }
      console.log("personnes cliqué", this.rows)
    }
  }

  ngOnInit(): void {

  }

  closeModal() {
    this.isOpenChange.emit(false);
  }

  openModalAbsence(){
    this.closeModal3 = false;
  }

}
