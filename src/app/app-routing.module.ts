import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagePlannificationComponent } from './pages/page-plannification/page-plannification.component';
import { PageCollecteDataComponent } from './pages/page-collecte-data/page-collecte-data.component';
import { PageReportingComponent } from './pages/page-reporting/page-reporting.component';
import { GetApiComponent } from './get-api/get-api.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { PageHomeComponent } from './pages/page-home/page-home.component';
import { LoadDataGuard } from './shared/guards/load-data.guard';
import { RedirectGuard } from './shared/guards/redirect.guard';
import { AdminGuard } from './shared/guards/admin.guard';
import { UserGuard } from './shared/guards/user.guard';
import { PageAccueilComponent } from './pages/page-accueil/page-accueil.component';
import { PageAbsenceComponent } from './pages/page-absence/page-absence.component';
import { PageRapportComponent } from './pages/page-rapport/page-rapport.component';

const routes: Routes = [
  {path:"", pathMatch:"full", redirectTo:"gestion/collecte"},
  {
    path: "gestion",
    redirectTo: "gestion/collecte",
    pathMatch:"full",
  },
  {
    path: "gestion",
    canActivate: [AdminGuard],
    children: [
      { path: "collecte", component: PageCollecteDataComponent },
      { path: "planification", component: PagePlannificationComponent },
      { path: "reporting", component: PageReportingComponent },
      { path: "api", component: GetApiComponent },
    ]
  },
  {
    path:"user",
    redirectTo:"user/accueil",
    pathMatch:"full"
  },
  {
    path: "user",
    canActivate: [UserGuard],
    children: [
      { path: "accueil", component: PageAccueilComponent },
      { path: "absences", component: PageAbsenceComponent },
      { path: "rapports", component: PageRapportComponent },
    ]
  },
  {
    path: "home",
    component: PageHomeComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
