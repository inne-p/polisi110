import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { LocationTracker } from '../../providers/location-tracker/location-tracker';
import { Home } from '../../pages/home/home';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Component({
  templateUrl: 'build/pages/login/login.html',
})
export class LoginPage {

  login: any = {};
  submitted = false;
  
  constructor(private http: Http, public alertController: AlertController, public navCtrl: NavController, private tracker: LocationTracker) {
  }
  
  showAlert() {
    let alert = this.alertController.create({
      title: 'Perhatian',
      subTitle: 'Login Gagal, mungkin user atau passwordnya keliru atau tidak ada koneksi internet',
      buttons: ['OK']
    });
    alert.present();
  }
  
  handleError(error) {
        console.error(error);
		this.showAlert();
  }

  getLogin()
  {
	console.log(this.login);
	let url= this.tracker.url + "Users/login";
	let headers = new Headers({ 'Content-Type': 'application/json' });
	let options = new RequestOptions({ headers: headers });

	let postBodyLogin: any = {
	  "username": this.login.nrp,
	  "password": this.login.password
	};

	this.http.post(url, postBodyLogin, options)
			.subscribe(data => 
			{
				let body = data.json();
				console.log(body);				
				this.tracker.logedin(this.login.nrp, body);
				this.navCtrl.setRoot(Home)
			},
			error => 
			{
				this.showAlert();
				console.log(error);
			});
			
  }

}
