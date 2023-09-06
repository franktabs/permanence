import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { Subject, take, takeUntil } from 'rxjs';
import { LoaderService } from './shared/services/loader.service';
import axios from 'axios';
import { AlertService } from './shared/services/alert.service';
import { ApiService } from './shared/services/api.service';
import { IParameter } from './shared/interfaces/iparameter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  public isConnected: boolean = false;
  constructor(
    private auth: AuthService,
    private loader: LoaderService,
    private alert: AlertService,
    private api: ApiService
  ) {}

  public loaderVisible: boolean = false;
  public destroys$!: Subject<boolean>;
  public urlBasicBackend: string = '';
  public visible: boolean = false;

  ngOnInit(): void {
    this.loader.loader_modal$.subscribe((subs) => {
      this.loaderVisible = subs;
    });

    this.destroys$ = new Subject();
    this.auth.isConnected$.pipe(takeUntil(this.destroys$)).subscribe((sub) => {
      this.isConnected = sub && this.auth.rolesName.includes('SE CONNECTER');
    });
    this.loader.init_data$.pipe(takeUntil(this.destroys$)).subscribe((sub) => {
      this.loader.loader_modal$.next(false);
      this.visible = sub;
      if (sub == true) {
        console.log('Une configuration en attente');
      }
    });
  }

  ngOnDestroy(): void {
    this.destroys$.next(true);
  }

  async giveUrl() {

    this.loader.loader_modal$.next(true)
    try {
      await axios.get(this.urlBasicBackend + '/role');
      let parametre: IParameter = {
        code: 'urlBackend',
        libelle: 'API BASIC BACKEND',
        valeur: this.urlBasicBackend,
      };
      this.api.IP = this.urlBasicBackend;
      this.api.initIP()
      await axios.post(this.api.URL_PARAMETERS, parametre);
      localStorage.setItem("urlBackend", this.urlBasicBackend)
      location.reload();
    } catch (e) {
      console.error("voici l'erreur ", e);
      this.alert.alertError();
    }
    this.loader.loader_modal$.next(false)
  }

}
