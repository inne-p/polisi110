import { Injectable } from '@angular/core';
import {Storage, SqlStorage} from 'ionic-angular';
import 'rxjs/add/operator/map';

export class DataLaporan {
	jenis: string;
	alamat: string;
	isiLaporan: string;
	tgl: string;
	koordinat: string;
	foto: string;
}

@Injectable()
export class SqliteService {
  storage: Storage = null;
  
  constructor() {
  	this.storage = new Storage(SqlStorage);
    this.storage.query("CREATE TABLE IF NOT EXISTS lp (id INTEGER PRIMARY KEY AUTOINCREMENT, tgl TEXT, jenis TEXT, device TEXT, geolokasi TEXT, alamat TEXT, laporan TEXT, foto TEXT) ");
  }

  public getLaporan() {
	return this.storage.query("SELECT * from lp");
  }
  
  public saveLaporan(laporan: DataLaporan)
  {
	console.log(laporan);
	this.storage.query("INSERT INTO LP (tgl, jenis, device, geolokasi, alamat, laporan, foto) values (?,?,?,?,?,?,?)",
	[new Date().toJSON(), laporan.jenis,"",laporan.koordinat, laporan.alamat, laporan.isiLaporan, laporan.foto]).then((data) => {
		console.log(this.getLaporan());
	}, (error) => {
            console.log(error);
    });
	
  }
}

