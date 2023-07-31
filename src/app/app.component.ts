import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{

  public isConnected:boolean = false;
  constructor(private auth:AuthService){}

  public destroys$!:Subject<boolean>;
  
  ngOnInit(): void {
    this.destroys$ = new Subject()
      this.auth.isConnected$.pipe(takeUntil(this.destroys$)).subscribe((sub)=>{
        this.isConnected = sub;
      })
  }

  ngOnDestroy(): void {
      this.destroys$.next(true);
  }
}
