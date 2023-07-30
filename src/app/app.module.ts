import { NgModule, OnInit } from '@angular/core';
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
    PageHomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [ApiService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule {


 }
