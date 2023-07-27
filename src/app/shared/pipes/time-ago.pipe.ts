import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date): string {
    console.log("viens du pipe timeAge", value)
    const seconds = Math.floor((+new Date() - +value) / 1000);

    if (seconds < 60) {
      return 'Il y a quelques secondes';
    }

    const intervals:any = {
      'année': 31536000,
      'mois': 2592000,
      'semaine': 604800,
      'jour': 86400,
      'heure': 3600,
      'minute': 60,
      'seconde': 1
    };

    let counter;
    for (const interval in intervals) {
      counter = Math.floor(seconds / intervals[interval]);
      if (counter > 0) {
        if (counter === 1 || interval=="mois") {
          return 'Il y a ' + counter + ' ' + interval;
        } else {
          return 'Il y a ' + counter + ' ' + interval + 's';
        }
      }else if(counter <= 0 && interval==="seconde") {
        return "temps à venir"
      }
    }

    return value.toString();
  }
}
