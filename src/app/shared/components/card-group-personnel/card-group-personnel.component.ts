import { Component, Input, OnInit } from '@angular/core';
import IGroupe from '../../interfaces/igroupe';

@Component({
  selector: 'app-card-group-personnel',
  templateUrl: './card-group-personnel.component.html',
  styleUrls: ['./card-group-personnel.component.scss']
})
export class CardGroupPersonnelComponent implements OnInit {

  @Input()
  public groupe:IGroupe= {nom:"group", criteres:[], personnels:[]};
  

  constructor() { }

  ngOnInit(): void {

  }

}
