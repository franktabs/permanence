import { Component, OnInit } from '@angular/core';
import { TypePersonnel } from '../../utils/types-map';
import { FormControl } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Observable, map, startWith } from 'rxjs';
import { IApiPersonnel } from '../../interfaces/iapipersonnel';
import { IPersonnel } from '../../interfaces/ipersonnel';
import { mapJSON } from '../../utils/function';
import { mapPersonnel } from '../../utils/tables-map';

@Component({
  selector: 'app-personnel-autocomplete',
  templateUrl: './personnel-autocomplete.component.html',
  styleUrls: ['./personnel-autocomplete.component.scss']
})
export class PersonnelAutocompleteComponent implements OnInit {


  private _options!:TypePersonnel[];
  public controlSuperviseur = new FormControl<string | TypePersonnel>("");
  public filteredOptions$!:Observable<TypePersonnel[]>


  constructor(private api:ApiService) { }

  ngOnInit(): void {

    
    this.api.getAllData<IApiPersonnel[]>({for:"personnels"}).subscribe((subs)=>{
      let transSubs = mapJSON<IApiPersonnel, IPersonnel>(subs, mapPersonnel);
      this.options = transSubs;

    });
  }

  set options (value:TypePersonnel[]){
    this._options = value;
    this.filteredOptions$ = this.controlSuperviseur.valueChanges.pipe(
      startWith(""),
      map(value => {
        let name = ""
        if(typeof value =="string"){

           name = value 

        }else if(value) {
          let unkOption : string = value.nom as string
          name = unkOption;
        }
        return name ? this._filter(name as string).slice(0, 5) : this.options.slice().slice(0, 5);
      }),
    )
    
    this.controlSuperviseur.valueChanges.subscribe((subs)=>{
      
    })
  }

  get options(){
    return this._options;
  }

  displayFn(personnel:TypePersonnel):string{
    if(personnel){
      let unkName:string = personnel.nom as string;
      return unkName
    }
    return ""
  }

  private _filter(name:string):TypePersonnel[]{
    const filterValue = name.toLowerCase();
    return this.options.filter(option =>{
      let unkOption : string = option.nom as any
      return unkOption.toLowerCase().includes(filterValue)
    });
  }

}
