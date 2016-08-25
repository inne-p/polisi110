import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { LocationTracker } from '../../providers/location-tracker/location-tracker';

@Component({
  templateUrl: 'build/pages/detail-kasus-saya/detail-kasus-saya.html',
})
export class DetailKasusSayaPage {

  public kasus : any;
  constructor(private navCtrl: NavController,  params: NavParams, private tracker:LocationTracker, private http: Http, private alertController: AlertController) {
	this.kasus = params.get("param");
    let url: string = "http://107.167.177.146/api-polisi110/api/police_reports?filter[where][id]="+this.kasus.id+"&access_token=" +  this.tracker.token;
	let headers = new Headers({ 'Content-Type': 'application/json' });
	let options = new RequestOptions({ headers: headers });
	this.http.get(url, options)
			.subscribe((data) => 
			{
				let items = data.json()[0];
				this.kasus.foto = items.foto;
				this.kasus.lat = items.geolokasi.lat;
				this.kasus.lng = items.geolokasi.lng;
				console.log(items);
			},
			error => 
			{
				let alert = this.alertController.create({
				  title: 'Peringatan',
				  subTitle: 'Pengambilan data gagal. Cek koneksi internet',
				  buttons: ['OK']
				});
				alert.present();
			});

	
  }
  
  openMap()
  {
	let destination = this.kasus.lat + ',' + this.kasus.lng;

	let label = encodeURI(destination);
	window.open('geo:0,0?q=' + destination + '(' + destination + ')', '_system');
  }

}
