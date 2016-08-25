import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/kasus-110/kasus-110.html'
})
export class Kasus110Page {
  public itemsList : any = [];
  constructor(private navCtrl: NavController) {
	this.itemsList = [];
	this.itemsList.push({"kejadian":"Pencurian", "lokasi":"Jl Asem Bagus", "id":1,"tgl":"28/01/2016","jam":"10:00:01"});
    this.itemsList.push({"kejadian":"Perampokan", "lokasi":"Jl Sudirman", "id":2,"tgl":"29/01/2016","jam":"10:00:01"});
    this.itemsList.push({"kejadian":"Kehilangan", "lokasi":"Jl Malabar", "id":3,"tgl":"30/01/2016","jam":"10:00:01"});
    this.itemsList.push({"kejadian":"Pembunuhan", "lokasi":"Jl Mekar Raya no 10", "id":4,"tgl":"31/01/2016","jam":"10:00:01"});
	console.log(this.itemsList);
  }

}
