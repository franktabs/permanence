import { Pipe, PipeTransform } from '@angular/core';
import { KeyOfAllType, TypePersonnel } from '../utils/types-map';

@Pipe({
  name: 'displayKey'
})
export class DisplayKeyPipe implements PipeTransform {

  transform(value: string, type:"remplacement"|"absence"|"personnel"|"any"="any"): string {
    let val : KeyOfAllType = value as any;
    if(val==="nom" && type ==="remplacement"){
      return "Remplaceur"
    }
    else if(val ==="telephoneCisco"){
      return "contact 1"
    }else if(val==="libAge"){
      return "secteur"
    }else if(val==="telephoneMobile"){
      return "contact 2"
    } else if(val==="start"){
      return "debut"
    } else if(val ==="end"){
      return "fin"
    } else if(val==="submissionDate"){
      return "Soumis le"
    } else if(val=="firstname"){
      return "Nom "
    } 

    return value
  }

}
