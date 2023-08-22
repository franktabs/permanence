import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { TypePersonnel } from '../../utils/types-map';
import { FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Observable, map, startWith } from 'rxjs';
import { IApiPersonnel } from '../../interfaces/iapipersonnel';
import { IPersonnel } from '../../interfaces/ipersonnel';
import { mapJSON } from '../../utils/function';
import { mapPersonnel } from '../../utils/tables-map';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-personnel-autocomplete',
  templateUrl: './personnel-autocomplete.component.html',
  styleUrls: ['./personnel-autocomplete.component.scss'],
})
export class PersonnelAutocompleteComponent implements OnInit, OnChanges {
  @Output()
  dataPerson: EventEmitter<TypePersonnel | string | null> = new EventEmitter();
  @Input() forLabel: string = 'Label';
  @Input() forPlaceholder: string = 'message';
  @Input() name: string = '';
  @Input() options!: TypePersonnel[];
  @Input() initialValue!: TypePersonnel|string;
  public controlSuperviseur = new FormControl<string | TypePersonnel>('frank');
  public filteredOptions$!: Observable<TypePersonnel[]>;


  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.controlSuperviseur.valueChanges.subscribe((subs) => {
      this.dataPerson.emit(subs);
    });
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      if (changes['options'].currentValue) {
        this.options = changes['options'].currentValue;
        this.options.sort((opt1, opt2)=>{
          return opt1.firstname.localeCompare(opt2.firstname);
        })
        this.filteredOptions$ = this.controlSuperviseur.valueChanges.pipe(
          startWith(''),
          map((value) => {
            let name = '';
            if (typeof value == 'string') {
              name = value;
            } else if (value) {
              let unkOption: string = value.firstname as string;
              name = unkOption;
            }
            return name
              ? this._filter(name as string).slice(0, 5)
              : this.options.slice().slice(0, 5);
          })
        );
      }
    }
    if(changes['initialValue']){
      let initialValue:TypePersonnel = changes['initialValue'].currentValue;
      console.log("initialValue", initialValue)
      this.controlSuperviseur.setValue(initialValue);
    }
  }

  // set options(value: TypePersonnel[]) {
  //   this._options = value;
  //   this.filteredOptions$ = this.controlSuperviseur.valueChanges.pipe(
  //     startWith(''),
  //     map((value) => {
  //       let name = '';
  //       if (typeof value == 'string') {
  //         name = value;
  //       } else if (value) {
  //         let unkOption: string = value.nom as string;
  //         name = unkOption;
  //       }
  //       return name
  //         ? this._filter(name as string).slice(0, 5)
  //         : this.options.slice().slice(0, 5);
  //     })
  //   );
  // }

  // get options() {
  //   return this._options;
  // }

  displayFn(personnel: TypePersonnel): string {
    if (personnel) {
      let unkName: string = personnel.firstname as string;
      return unkName;
    }
    return '';
  }

  private _filter(name: string): TypePersonnel[] {
    const filterValue = name.toLowerCase();
    return this.options.filter((option) => {
      let unkOption: string = option.firstname as any;
      return unkOption.toLowerCase().includes(filterValue);
    });
  }
}
