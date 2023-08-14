import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  public loader_modal$: Subject<boolean> = new Subject();

  constructor() {
    this.loader_modal$.next(false);
  }
}
