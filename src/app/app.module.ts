import { LOCALE_ID, NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { GetApiComponent } from './get-api/get-api.component';
import { NavigationHeaderComponent } from './navigations/navigation-header/navigation-header.component';
import { NavigationLeftComponent } from './navigations/navigation-left/navigation-left.component';
import { PagePlannificationComponent } from './pages/page-plannification/page-plannification.component';
import { PageCollecteDataComponent } from './pages/page-collecte-data/page-collecte-data.component';
import { PageReportingComponent } from './pages/page-reporting/page-reporting.component';
import { ContainerComponent } from './pages/container/container.component';
import { Card1Component } from './shared/components/card1/card1.component';
import { DayJsPipe } from './shared/pipes/day-js.pipe';
import { TimeAgoPipe } from './shared/pipes/time-ago.pipe';
import { Table1Component } from './shared/components/table1/table1.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material/material.module';
import { ApiService } from './shared/services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { Card2Component } from './shared/components/card2/card2.component';
import { Line1Component } from './shared/components/line1/line1.component';
import { Modal1Component } from './shared/components/modal1/modal1.component';
import { AuthService } from './shared/services/auth.service';
import { PageHomeComponent } from './pages/page-home/page-home.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { LoadDataGuard } from './shared/guards/load-data.guard';
import { Card3Component } from './shared/components/card3/card3.component';
import { Modal2Component } from './shared/components/modal2/modal2.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Modal3Component } from './shared/components/modal3/modal3.component';
import { ModalExemple1Component } from './shared/components/modal-exemple1/modal-exemple1.component';
import { CardAbsenceComponent } from './shared/components/card-absence/card-absence.component';
import { UserInfoModalComponent } from './shared/components/modals/user-info-modal/user-info-modal.component';
import { PageAccueilComponent } from './pages/page-accueil/page-accueil.component';
import { PageAbsenceComponent } from './pages/page-absence/page-absence.component';
import { PageRapportComponent } from './pages/page-rapport/page-rapport.component';
import { DisplayKeyPipe } from './shared/pipes/display-key.pipe';
import { MyDivDirective } from './shared/directives/my-div.directive';
import { ModalPlanificationComponent } from './shared/components/modal-planification/modal-planification.component';
import { HeadModalDefaultComponent } from './shared/components/head-modal-default/head-modal-default.component';
import { DayComponent } from './shared/components/day/day.component';
import { FromDatePipe } from './shared/pipes/from-date.pipe';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { PersonnelAutocompleteComponent } from './shared/components/personnel-autocomplete/personnel-autocomplete.component';
import { CardPlanningComponent } from './shared/components/card-planning/card-planning.component';
import { ParaComponent } from './parametres/para/para.component';
import { ModificationComponent } from './parametres/modification/modification.component';
import { ModalPermanenceComponent } from './shared/components/modal-permanence/modal-permanence.component';
import { LoaderService } from './shared/services/loader.service';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { AlertMaterialComponent } from './shared/components/alert-material/alert-material.component';
import { AlertService } from './shared/services/alert.service';
import { ModalRoleComponent } from './shared/components/modal-role/modal-role.component';
import { LimitStringPipe } from './shared/pipes/limit-string.pipe';
import { ModalAbsenceComponent } from './shared/components/modal-absence/modal-absence.component';
import { ModalHolidayComponent } from './shared/components/modal-holiday/modal-holiday.component';
import { PageParameterComponent } from './pages/page-parameter/page-parameter.component';


registerLocaleData(localeFr)
@NgModule({
  declarations: [
    AppComponent,
    GetApiComponent,
    NavigationHeaderComponent,
    NavigationLeftComponent,
    PagePlannificationComponent,
    PageCollecteDataComponent,
    PageReportingComponent,
    ContainerComponent,
    Card1Component,
    DayJsPipe,
    TimeAgoPipe,
    Table1Component,
    Card2Component,
    Line1Component,
    Modal1Component,
    PageHomeComponent,
    Card3Component,
    Modal2Component,
    Modal3Component,
    ModalExemple1Component,
    CardAbsenceComponent,
    UserInfoModalComponent,
    PageAccueilComponent,
    PageAbsenceComponent,
    PageRapportComponent,
    DisplayKeyPipe,
    MyDivDirective,
    ModalPlanificationComponent,
    HeadModalDefaultComponent,
    DayComponent,
    FromDatePipe,
    PersonnelAutocompleteComponent,
    CardPlanningComponent,
    ParaComponent,
    ModificationComponent,
    ModalPermanenceComponent,
    LoaderComponent,
    AlertMaterialComponent,
    ModalRoleComponent,
    LimitStringPipe,
    ModalAbsenceComponent,
    ModalHolidayComponent,
    PageParameterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    
  ],
  providers: [ApiService, AuthService, AuthGuard, LoadDataGuard, LoaderService,AlertService, {provide: LOCALE_ID, useValue:"fr-FR"}],
  bootstrap: [AppComponent]
})
export class AppModule {


 }
