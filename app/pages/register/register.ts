import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LocationTracker } from '../../providers/location-tracker/location-tracker';
import { LoginPage } from '../../pages/login/login';

@Component({
  templateUrl: 'build/pages/register/register.html'
})
export class RegisterPage {
  register: any = {};
  submitted = false;
  
  constructor(public navCtrl: NavController, private tracker: LocationTracker) 
  {

  }
  getRegister()
  {
  	this.tracker.register(this.register.nohp);
	console.log(this.register);
	this.navCtrl.setRoot(LoginPage);
  }


}
