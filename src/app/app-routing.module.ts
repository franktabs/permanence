import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagePlannificationComponent } from './pages/page-plannification/page-plannification.component';
import { PageCollecteDataComponent } from './pages/page-collecte-data/page-collecte-data.component';
import { PageReportingComponent } from './pages/page-reporting/page-reporting.component';
import { GetApiComponent } from './get-api/get-api.component';

const routes: Routes = [
  {path:"", component:PageCollecteDataComponent},
  { path: "planification", component: PagePlannificationComponent },
  { path: "reporting", component: PageReportingComponent },
  { path: "api", component: GetApiComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
