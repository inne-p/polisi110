import { Component, ViewChild } from '@angular/core';
import { ionicBootstrap, Platform, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import {enableProdMode} from '@angular/core';

import { Home } from './pages/home/home';
import { Laporan } from './pages/laporan/laporan';
import { RegisterPage } from './pages/register/register';
import { LoginPage } from './pages/login/login';
import { Kasus110Page } from './pages/kasus-110/kasus-110';
import { LocationTracker } from './providers/location-tracker/location-tracker';

@Component({
  templateUrl: 'build/app.html'
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = RegisterPage;

  pages: Array<{title: string, component: any}>;

  constructor(public tracker: LocationTracker, public platform: Platform) {
    this.initializeApp(tracker);
    this.pages = [
      { title: 'Beranda', component: Home },
      { title: 'Laporan Polisi', component: Laporan },
      { title: 'Kasus', component: Kasus110Page },	
      { title: 'Ganti Petugas', component: LoginPage }
    ];

  }

  initializeApp(tracker: LocationTracker) {
    this.platform.ready().then(() => {
		tracker.getConfig("nohp").then((data) => {
			let res = data.res;
			if (res.rows.length>0) {
				tracker.getConfig("token").then((data) => {
					this.nav.setRoot(Home);
				},
				(error)=> {
					this.nav.setRoot(LoginPage);
				});
			}
			else{ 				
				this.nav.setRoot(RegisterPage);
			}
		}, (error) => {
				console.log("ERROR: " + JSON.stringify(error));
				this.nav.setRoot(RegisterPage);
		});
		StatusBar.styleDefault();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }
}
enableProdMode();
ionicBootstrap(MyApp, [LocationTracker]);
