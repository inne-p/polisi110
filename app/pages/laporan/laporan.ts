import { Component } from '@angular/core';
import { NavController, NavParams, SqlStorage, Storage,  AlertController } from 'ionic-angular';
import {Camera} from 'ionic-native';
import { Geolocation } from 'ionic-native';
import {SqliteService, DataLaporan} from '../../providers/sqlite-service/sqlite-service';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { LocationTracker } from '../../providers/location-tracker/location-tracker';

@Component({
  selector: 'laporan',
  templateUrl: 'build/pages/laporan/laporan.html',
  providers: [SqliteService]
})

export class Laporan {
  selectedItem: any;
  public showing= true;
  private storage: Storage;
  public base64Image: string;
  laporan :any = {}
  public url: string = "http://107.167.177.146/api-polisi110/api/";

  constructor(private nav: NavController, private http: Http, public sqliteService: SqliteService, public tracker: LocationTracker, private alertController:  AlertController) {
	this.base64Image = "150x150.png";

   }

  saveIt() {

	console.log("saveIt");

    this.showing = false;
	Geolocation.getCurrentPosition().then((position) => {
	    this.laporan.koordinat = "{" + position.coords.latitude + "," + position.coords.longitude + "}";
		if (this.base64Image) {
			this.laporan.foto = this.base64Image;
		}
		//this.sqliteService.saveLaporan(this.laporan);
	
		let url= this.url + "police_reports?access_token=" + this.tracker.token;
		let postBodyLogin: any = {
		  "id" : 0,
		  "foto": this.base64Image,
		  "isilaporan": this.laporan.isiLaporan,
		  "jenis": this.laporan.jenis,
		  "nrp": this.tracker.nrp,
		  "tgl": new Date().toJSON(),
		  "lokasi_alamat": this.laporan.alamat,
		  "geolokasi": {
			"lat": position.coords.latitude,
			"lng": position.coords.longitude
		  }
		};
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		this.http.post(url, postBodyLogin, options)
				.subscribe(data => 
				{
					console.log(data);
					this.showing = true;
					this.laporan.jenis = 0;
					this.laporan.alamat = "";
					this.laporan.isiLaporan = "";
					this.base64Image = "150x150.png";
					let alert = this.alertController.create({
					  title: 'Selamat',
					  subTitle: 'Pengiriman laporan berhasil',
					  buttons: ['OK']
					});
					alert.present();
				},
				error => 
				{
					this.showing = true;
					console.log(error);
					this.showAlert();
				});
	},
	(error)=> {
	    this.showing = true;
		let alert = this.alertController.create({
		  title: 'Perhatian',
		  subTitle: 'Geolokasi (mendapatkan koordinat gagal, tidak bisa kirim data',
		  buttons: ['OK']
		});
		alert.present();
	});
  }
  
    showAlert() {
    let alert = this.alertController.create({
      title: 'Perhatian',
      subTitle: 'Pengiriman laporan Gagal, coba cek koneksi internet',
      buttons: ['OK']
    });
    alert.present();
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
