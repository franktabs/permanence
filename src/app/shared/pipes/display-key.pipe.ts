import { Pipe, PipeTransform } from '@angular/core';
import { KeyOfAllType, TypePersonnel } from '../utils/types-map';

@Pipe({
  name: 'displayKey'
})
export class DisplayKeyPipe implements PipeTransform {

  transform(value: string): string {
    let val : KeyOfAllType = value as any;
    if(val ==="contact1"){
      return "contact 1"
    }else if(val==="libAge"){
      return "secteur"
    }else if(val==="contact2"){
      return "contact 2"
    } else if(val==="start"){
      return "debut"
    } else if(val ==="end"){
      return "fin"
    } else if(val==="submissionDate"){
      return "Soumis le"
    }

    return value
  }

}
