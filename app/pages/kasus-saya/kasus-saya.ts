import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { DetailKasusSayaPage } from '../../pages/detail-kasus-saya/detail-kasus-saya';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { LocationTracker } from '../../providers/location-tracker/location-tracker';

@Component({
  templateUrl: 'build/pages/kasus-saya/kasus-saya.html',
})
export class KasusSayaPage {
  public itemsList : any = [];
  public url: string = "http://107.167.177.146/api-polisi110/api/police_reports?filter[order]=id desc&filter[limit]=10&filter[fields][foto]=false&filter[where][nrp]="+this.tracker.nrp+"&access_token=" +  this.tracker.token;;
  constructor(private navCtrl: NavController, private http: Http, private tracker: LocationTracker, private alertController: AlertController) {
		this.itemsList = [];
//		this.itemsList.push({"kejadian":"Pencurian", "lokasi":"Jl Asem Bagus", "id":1,"tgl":"28/01/2016","jam":"10:00:01"});
//		this.itemsList.push({"kejadian":"Perampokan", "lokasi":"Jl Sudirman", "id":2,"tgl":"29/01/2016","jam":"10:00:01"});
//		this.itemsList.push({"kejadian":"Kehilangan", "lokasi":"Jl Malabar", "id":3,"tgl":"30/01/2016","jam":"10:00:01"});
//		this.itemsList.push({"kejadian":"Pembunuhan", "lokasi":"Jl Mekar Raya no 10", "id":4,"tgl":"31/01/2016","jam":"10:00:01"});
//		console.log(this.itemsList);

		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		this.http.get(this.url, options)
				.subscribe((data) => 
				{
					let items = data.json();
					for (let i = 0;i<items.length; i++)
					{
						this.itemsList.push(items[i]);
					}
					console.log(this.itemsList);
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
  detailmycase(item: any)
  {
	this.navCtrl.push(DetailKasusSayaPage, {param: item});
  }
}
