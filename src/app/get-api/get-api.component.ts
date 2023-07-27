import { Component, OnInit } from '@angular/core';
import axios from "axios"

@Component({
  selector: 'app-get-api',
  templateUrl: './get-api.component.html',
  styleUrls: ['./get-api.component.scss']
})
export class GetApiComponent implements OnInit {
  public data!:string;

  async ngOnInit(): Promise<void> {
    let result = await axios.get("http://192.168.2.64:8080/gestion/direction/allDirections");
    this.data = JSON.stringify(result.data);
  }

}
