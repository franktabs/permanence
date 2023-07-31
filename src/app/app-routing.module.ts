import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagePlannificationComponent } from './pages/page-plannification/page-plannification.component';
import { PageCollecteDataComponent } from './pages/page-collecte-data/page-collecte-data.component';
import { PageReportingComponent } from './pages/page-reporting/page-reporting.component';
import { GetApiComponent } from './get-api/get-api.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { PageHomeComponent } from './pages/page-home/page-home.component';
import { LoadDataGuard } from './shared/guards/load-data.guard';

const routes: Routes = [
  {
    path: "",
    canActivate: [LoadDataGuard],
    children:[
      {
        path:"",
        component: PageCollecteDataComponent
      },
      { path: "planification", component: PagePlannificationComponent },
      { path: "reporting", component: PageReportingComponent },
      { path: "api", component: GetApiComponent },
    ],
   
  },
  {
    path:"home",
    component:PageHomeComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
