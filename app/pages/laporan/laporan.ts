import { Component } from '@angular/core';
import { NavController, NavParams, SqlStorage, Storage } from 'ionic-angular';
import {Camera} from 'ionic-native';
import { Geolocation } from 'ionic-native';
import {SqliteService, DataLaporan} from '../../providers/sqlite-service/sqlite-service';

@Component({
  selector: 'laporan',
  templateUrl: 'build/pages/laporan/laporan.html',
  providers: [SqliteService]
})

export class Laporan {
  selectedItem: any;
  private storage: Storage;
  public base64Image: string;
  laporan :any = {}
  
  constructor(public sqliteService: SqliteService) {
    // If we navigated to this page, we will have an item available as a nav param
	this.base64Image = "150x150.png";

   }

  saveIt() {
    //this.storage.query("INSERT INTO lp (tgl, jenis, device, geolokasi, alamat, laporan, foto) VALUES (?, ?, ?, ?, ?, ?, ?)", 
	//[new Date().toLocaleDateString(), "Raboy"]).then((data) => {
    //}, (error) => {
    //        console.log(error);
    //});
	Geolocation.getCurrentPosition().then((position) => {
	    this.laporan.koordinat = "{" + position.coords.latitude + "," + position.coords.longitude + "}";
		if (this.base64Image) {
			this.laporan.foto = this.base64Image;
		}
		this.sqliteService.saveLaporan(this.laporan);
	});
  }
  
  captureCamera() {
	Camera.getPicture({
        destinationType: Camera.DestinationType.DATA_URL,
        targetWidth: 640,
        targetHeight: 480
    }).then((imageData) => {
      // imageData is a base64 encoded string
        this.base64Image = "data:image/jpeg;base64," + imageData;
		console.log(this.base64Image);
    }, (err) => {
        console.log(err);
    });  
  }
}
