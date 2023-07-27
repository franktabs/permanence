import { NgModule, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import axios from 'axios';
import { GetApiComponent } from './get-api/get-api.component';
import { NavigationHeaderComponent } from './navigations/navigation-header/navigation-header.component';
@NgModule({
  declarations: [
    AppComponent,
    GetApiComponent,
    NavigationHeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {


 }
