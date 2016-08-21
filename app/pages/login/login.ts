import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LocationTracker } from '../../providers/location-tracker/location-tracker';
import { Home } from '../../pages/home/home';

@Component({
  templateUrl: 'build/pages/login/login.html',
})
export class LoginPage {

  login: any = {};
  submitted = false;
  
  constructor(public navCtrl: NavController, private tracker: LocationTracker) {
  }
  getLogin()
  {
	this.tracker.logedin(this.login.nrp);
	console.log(this.login);
	this.navCtrl.setRoot(Home);
  }

}
