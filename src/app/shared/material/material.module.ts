import { NgModule } from '@angular/core';
import { MatTableModule} from "@angular/material/table"
import {MatPaginatorModule} from "@angular/material/paginator"
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import {MatBadgeModule} from "@angular/material/badge"
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

const moduleMaterial = [
  MatPaginatorModule,
  MatTableModule,
  MatSortModule,
  MatBadgeModule,
  MatButtonModule,
  MatSelectModule,
  MatFormFieldModule
]

@NgModule({
  imports: moduleMaterial,
  exports:moduleMaterial
})
export class MaterialModule { }
