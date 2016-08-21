import { Injectable } from '@angular/core';
import { Geolocation } from 'ionic-native';
import {Network} from 'ionic-native';
import { Observable } from 'rxjs/Observable';
import { BackgroundGeolocation } from 'ionic-native';
import {Platform} from 'ionic-angular';
import {Storage, SqlStorage} from 'ionic-angular';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

export class DataLogin {
	nrp: string;
	password: string;
}

declare var Connection;

@Injectable()
export class LocationTracker {
  positionObserver: any;
  position: any;
  watch: any;
  subscription : any;
  onDevice: boolean;
  storage : any;
  public nrp: string;
  config: any;
  public nohp: string;
  
  public isRegistered() {
    let retval = false;
    this.getConfig("nohp").then((data) => {
		let res = data.res;
		if (res.rows.length>0) {
			this.nohp = res.rows.item(0).value;
			retval = true;
		}
		else{ retval = false;}
	}, (error) => {
            console.log("ERROR: " + JSON.stringify(error));
			retval = false;
    });
	console.log(retval);
	return retval;
  }
    
  public logedin(nrp: string) {
    this.nrp = nrp;
  }
  public register(nohp: string) {
    this.nohp = nohp;
    this.storage.query("INSERT OR REPLACE INTO config (name, value) values (?,?)",
	["nohp", nohp]).then((data) => {
		console.log("save nohp");
	}, (error) => {
            console.log(error);
    });
  }
  
  constructor(private http: Http, private platform: Platform) {
   	this.storage = new Storage(SqlStorage);
    this.storage.query("CREATE TABLE IF NOT EXISTS tracker (id INTEGER PRIMARY KEY AUTOINCREMENT, tgl TEXT, lokasi TEXT, status TEXT) ");
    this.storage.query("CREATE TABLE IF NOT EXISTS config (name TEXT PRIMARY KEY, value TEXT) ");
    this.onDevice = this.platform.is('cordova');
  	this.positionObserver = null;
 
    this.position = Observable.create(observer => {
      this.positionObserver = observer;
    });
	this.getConfig("nohp").then((data) => {
		let res = data.res;
		if (res.rows.length>0) {
			this.nohp = res.rows.item(0).value;
		}
	}, (error) => {
            console.log("ERROR: " + JSON.stringify(error));
    });

  }
  isOnline(): boolean {
    if(this.onDevice && Network.connection){
      return Network.connection !== Connection.NONE;
    } else {
      return navigator.onLine; 
    }
  }
 
  isOffline(): boolean {
    if(this.onDevice && Network.connection){
      return Network.connection === Connection.NONE;
    } else {
      return !navigator.onLine;   
    }
  }
  
  startTracking() {
	// In App Tracking
  	  console.log("start tacking");
	 
	  let options = {
		frequency: 3000, 
		enableHighAccuracy: true     
	  };
	 
	  this.watch = Geolocation.watchPosition(options);
	 
	  this.subscription = this.watch.subscribe((data) => {
	  	this.notifyLocation(data.coords);
	  });
	  // Background Tracking
	 
	  let backgroundOptions = {
		desiredAccuracy: 10,
		stationaryRadius: 10,
		distanceFilter: 30,
		debug: true, //  enable this hear sounds for background-geolocation life-cycle.
        stopOnTerminate: false
	  };
	 
	  BackgroundGeolocation.configure(backgroundOptions).then((location) => {
		this.notifyLocation(location);
		
	  }).catch( (err) => {
		console.log(err);
	  });
	 
	  BackgroundGeolocation.start();	 
	  return this.position;
  
  }
 
  stopTracking() {
    BackgroundGeolocation.finish();
	this.subscription.unsubscribe(); 
	let d : any = {
		nrp : this.nrp,
		latitude : 0,
		longitude : 0,
		status : 0
	}
	this.upsert(d);
	
	this.storage.query("INSERT OR REPLACE INTO tracker (tgl, lokasi, status) values (?,?,?)",
	[new Date().toJSON(), "", 'inactive']).then((data) => {
		console.log("savetrack inactive");
	}, (error) => {
            console.log(error);
    });
  }
 
  public updateConfig(name: string, value: string)
  {
	this.storage.query("INSERT OR REPLACE INTO config (name, value) values (?,?)",
	[name, value]).then((data) => {
		console.log("savetrack inactive");
	}, (error) => {
            console.log(error);
    });
  }
  
  public getConfig(name: string)
  {
	    return this.storage.query("SELECT value from config where name = ?",[name]);
  }
  
  notifyLocation(location) {
	this.positionObserver.next(location);
	//nsole.log(location);
	let posisi = "{" + location.latitude + "," + location.longitude + "}";
	this.storage.query("INSERT OR REPLACE INTO tracker (tgl, lokasi, status) values (?,?,?)",
	[new Date().toJSON(), posisi, 'active']).then((data) => {
		console.log("savetrack");
		let d : any = {
			nrp : this.nrp,
			latitude : location.latitude,
			longitude : location.longitude,
			status : 1
		}
		this.upsert(d);
	}, (error) => {
            console.log(error);
    });
  }
  
    upsert(data: any = undefined) {
    let url: string = "http://107.167.177.146/api-polisi110/api/polices";
	
	let postBody: any = {
	  "NRP": data.nrp,
	  "email": "",
	  "idKantor": 0,
	  "lastPosition": {
		"lat": data.latitude,
		"lng": data.longitude
	  },
	  "lastStatus": data.status,
	  "lastTimePosition": new Date().toJSON(),
	  "lastTimeStatus": new Date().toJSON(),
	  "name": "",
	  "phonenumber": this.nohp
    };
	let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
	console.log(postBody);
    return this.http.put(url, postBody, options)
			.toPromise()
			.then(() => data)
			.catch(this.handleError);
	}
	handleError(error) {
        console.error(error);
		return Observable.throw(error.json().error || 'Server error');
	}
  

}

