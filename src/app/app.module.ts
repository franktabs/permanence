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
    TimeAgoPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {


 }
