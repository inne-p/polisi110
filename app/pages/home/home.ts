import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { Insomnia } from 'ionic-native';
import { LocationTracker } from '../../providers/location-tracker/location-tracker';

declare var google;

@Component({
  templateUrl: 'build/pages/home/home.html'
})

export class Home {
  tracker: any;
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  currentLocationMarker: any;
  currentLocation: any;
  coords: any;
  locationAccuracyMarker: any;
  latlng : any;
  mapInitialised: boolean = false;
  apiKey: any = "AIzaSyB16sGmIekuGIvYOfNoW9T44377IU2d2Es";
  http: any;
  
  ionViewLoaded(){
   // this.loadMap();
  }
  
  loadMap(){
 
    let latLng = new google.maps.LatLng(-34.9290, 138.6010);
 
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
 
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
 
  }
  
  /**
  * Create current position Marker
  */
  setCurrentLocationMarker(location) {
    // Set currentLocation @property
    this.currentLocation = location;
    this.coords = location;

    if (!this.currentLocationMarker) {
      this.currentLocationMarker = new google.maps.Marker({
        map: this.map,
        zIndex: 10,
        title: 'Current Location',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#2677FF',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeOpacity: 1,
          strokeWeight: 6
        }
      });
      this.locationAccuracyMarker = new google.maps.Circle({
        zIndex: 9,
        fillColor: '#3366cc',
        fillOpacity: 0.4,
        strokeOpacity: 0,
        map: this.map
      });
    }
    this.latlng = new google.maps.LatLng(this.coords.latitude, this.coords.longitude);

	this.currentLocationMarker.setPosition(this.latlng);
    this.locationAccuracyMarker.setCenter(this.latlng);
    this.locationAccuracyMarker.setRadius(this.coords.accuracy);
  }
  
  centerOnMe(location) {
    this.map.setCenter(new google.maps.LatLng(location.latitude, location.longitude));
    this.setCurrentLocationMarker(location);
  };
  
  static get parameters(){
    return [[LocationTracker]];
  }
 
  constructor(tracker: LocationTracker) {
    this.tracker = tracker;
	this.loadGoogleMaps();
  }
  
  loadGoogleMaps(){
     this.addConnectivityListeners();
	 console.log("User : " + this.tracker.nrp);
 
	if(typeof google == "undefined" || typeof google.maps == "undefined"){
 
		console.log("Google maps JavaScript needs to be loaded.");
		this.disableMap();
 
		if(this.tracker.isOnline()){
			console.log("online, loading map");
			window['mapInit'] = () => {
				this.initMap();
				this.enableMap();
			}
 
			let script = document.createElement("script");
			script.id = "googleMaps";
 
			if(this.apiKey){
				script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
			} else {
				script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';       
			}
 			document.body.appendChild(script);  
		} 
	}
	else {
 
		if(this.tracker.isOnline()){
		  console.log("showing map");
		  this.initMap();
		  this.enableMap();
		}
		else {
		  console.log("disabling map");
		  this.disableMap();
		}
 
	}
  }
	
  initMap(){
 
    this.mapInitialised = true; 
    Geolocation.getCurrentPosition().then((position) => {
		let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		let mapOptions = {
		  center: latLng,
		  zoom: 15,
		  mapTypeId: google.maps.MapTypeId.ROADMAP
		}	 
		this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions); 
    });
 
  }
 
  disableMap(){
    console.log("disable map");
  }
 
  enableMap(){
    console.log("enable map");
  }
  
  addConnectivityListeners(){
    var me = this;
 
    var onOnline = () => {
      setTimeout(() => {
        if(typeof google == "undefined" || typeof google.maps == "undefined"){
          this.loadGoogleMaps();
        } else {
          if(!this.mapInitialised){
            this.initMap();
          }
 
          this.enableMap();
        }
      }, 2000);
    };
 
    var onOffline = () => {
      this.disableMap();
    };
 
    document.addEventListener('online', onOnline, false);
    document.addEventListener('offline', onOffline, false);
 
  }
  start() {
	  Insomnia.keepAwake()
	  .then(
		() => console.log('success'),
		() => console.log('error')
	  );
    this.tracker.startTracking().subscribe((position) => {
	    if (this.map)
			this.centerOnMe(position);
        console.log(position);
    });
  }

  online(e) {
  
     console.log("going online");
	 console.log(e);
	 if (e._checked) {
		this.start();
	 }
	 else {
		this.stop();
	 }
  }
 
  stop() {
	Insomnia.allowSleepAgain()
	  .then(
		() => console.log('success'),
		() => console.log('error')
	  );
	this.tracker.stopTracking();
  }
  

}
