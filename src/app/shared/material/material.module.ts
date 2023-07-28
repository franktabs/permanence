import { NgModule } from '@angular/core';
import { MatTableModule} from "@angular/material/table"
import {MatPaginatorModule} from "@angular/material/paginator"
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import {MatBadgeModule} from "@angular/material/badge"

const moduleMaterial = [
  MatPaginatorModule,
  MatTableModule,
  MatSortModule,
  MatBadgeModule,
  MatButtonModule
]

@NgModule({
  imports: moduleMaterial,
  exports:moduleMaterial
})
export class MaterialModule { }
