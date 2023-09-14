import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'limitString',
})
export class LimitStringPipe implements PipeTransform {
  transform(chaine: string, n: number = 10): string {
    if (chaine.length <= n) {
      return chaine;
    } else {
      const chaineCoupee = chaine.slice(0, n);
      return chaineCoupee + '...';
    }
  }
}
