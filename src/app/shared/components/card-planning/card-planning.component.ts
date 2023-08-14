import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IPlanning } from '../../interfaces/iplanning';
import { IPermanence } from '../../interfaces/ipermanence';
import { ApiService } from '../../services/api.service';
import { concatMap, from, map, of } from 'rxjs';
import { IMonth } from '../../interfaces/imonth';
import axios from 'axios';

@Component({
  selector: 'app-card-planning',
  templateUrl: './card-planning.component.html',
  styleUrls: ['./card-planning.component.scss']
})
export class CardPlanningComponent implements OnInit {

  @Input() planning!:IPlanning;

  @Output() planningEmit:EventEmitter<IPlanning> = new EventEmitter()

  constructor(private api:ApiService) { }

  ngOnInit(): void {
  }


  handleClick(){
    this.planningEmit.emit(this.planning)
  }

  async handleSave(){
    let planningCopy = JSON.parse(JSON.stringify(this.planning));
    let monthsCopy = planningCopy.months;
    let permanences = null;
    let personnels_jours = null;
    let personnels_nuits = null;
    delete planningCopy.months;

    try{

      let response = await axios.post(this.api.URL_PLANNINGS, planningCopy)
      console.log("sauvegarde de planning", response.data)
      if(response.data.id){
        let idPlanning:number = response.data.id;
        if(monthsCopy)
        for(let month of monthsCopy){
          if(month.planning){
            month.planning.id = idPlanning;
          }
          permanences = month.permanences;
          delete month.permanences;
          response = await axios.post(this.api.URL_MONTHS, month)
          console.log("sauvegarde de mois", response.data)
          if(response.data.id){
            let idMonth:number = response.data.id;
            if(permanences){
              for(let permanence of permanences){
                if(permanence.month)
                permanence.month.id = idMonth;
                personnels_jours = permanence.personnels_jour;
                personnels_nuits = permanence.personnels_nuit;
                delete permanence.personnels_jour;
                delete permanence.personnels_nuit;
                response = await axios.post(this.api.URL_PERMANENCES, permanence)
                console.log("sauvegarde de permanence", response.data)
                if(response.data.id){
                  let idPermanence:number = response.data.id;
                  if(personnels_jours){
                    for(let personnel_jour of personnels_jours){
                      if(personnel_jour.permanence)
                      personnel_jour.permanence.id = idPermanence;
                      response = await axios.post(this.api.URL_PERSONNEL_JOURS, personnel_jour)
                      console.log("sauvegarde de personnel_jour", response.data)
                    }
                  }
                  if(personnels_nuits){
                    for(let personnel_nuit of personnels_nuits){
                      if(personnel_nuit.permanence)
                      personnel_nuit.permanence.id = idPermanence;
                      response = await axios.post(this.api.URL_PERSONNEL_NUITS, personnel_nuit)
                      console.log("sauvegarde de personnel_nuit", response.data)
                    }
                  }
                }
              }
            }
          }
        }
      }

    }catch(e){
      console.error("Voici les erreurs et difficulté",e);
    }
    


    // from([this.api.URL_PLANNINGS]).pipe(
    //   concatMap((url)=>{
    //     return this.api.postData<IPlanning>(url,planningCopy)
    //   }),
    //   concatMap((value)=>{
    //     if(value.id){
    //       console.log("Enregistrement Planning réussi");
    //       this.planning.id = value.id;
    //       if(monthsCopy){
    //         return monthsCopy
    //       }
    //       return of(null)
    //     }
    //     else{
    //       console.log("Enregistrement Planning échoué");
    //       return of(null)
    //     }
    //   }),
    //   concatMap((value)=>{
    //     if(value){
    //       return this.api.postData<IMonth>(this.api.URL_MONTHS, value)
    //     }
    //     return null
    //   })
    // )
    // this.api.postData<IPlanning>(this.api.URL_PLANNINGS, planningCopy).subscribe(
    //   (subs)=>{
    //     if(subs.id){
    //       console.log("Enregistrement Planning réussi");
    //       this.planning.id = subs.id;
    //       for(monthCopy)
    //     }
    //     else{
    //       console.log("Enregistrement Planning non réussi");
    //     }
    //   }
    // )
  }
}
