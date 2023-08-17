import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { LoaderService } from './shared/services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public isConnected: boolean = false;
  constructor(private auth: AuthService, private loader: LoaderService) {}

  public loaderVisible: boolean = false;
  public destroys$!: Subject<boolean>;

  ngOnInit(): void {
    this.loader.loader_modal$.subscribe((subs) => {
      this.loaderVisible = subs;
    });

    this.destroys$ = new Subject();
    this.auth.isConnected$.pipe(takeUntil(this.destroys$)).subscribe((sub) => {
      this.isConnected = sub && this.auth.rolesName.includes("SE CONNECTER");
    });
  }

  ngOnDestroy(): void {
    this.destroys$.next(true);
  }
}
