import { Component, OnInit } from '@angular/core';


//Carte qui fut utiliser pour donner à l'utilisateur la possibilité de faire une 
// une consultation et une soumission d'absences
@Component({
  selector: 'app-card3',
  templateUrl: './card3.component.html',
  styleUrls: ['./card3.component.scss']
})
export class Card3Component implements OnInit {

  public closeModal:boolean = true;
  public closeModal2:boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
