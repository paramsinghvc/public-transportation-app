import { Injectable, Inject } from '@angular/core';
import { Config } from '../config';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
var idb = require('idb');

@Injectable()
export class ApiService {
	_config: Config;
	_idb: any;

	constructor(public http: Http) {
		this._config = new Config();
		this._idb = idb.open('public-transportation', 1, function(upgradeDb) {
			upgradeDb.createObjectStore('stations');
			upgradeDb.createObjectStore('schedule');
		});
	}

	makeRequest(urlSegment: string, queryParams: Array<string>): any {
		queryParams.push(`key=${this._config.API_KEY}`);
		var url: string = `${this._config.BART_API_PREFIX}${urlSegment}?${queryParams.join('&')}`;
		return this.http.request(url).map(res => res.text());
	}

	getStations() {
		return Observable.fromPromise(this._idb.then(db => {
			var tx = db.transaction('stations');
			var stationsStore = tx.objectStore('stations');
			return stationsStore.get('stations');
		}).then(s => {
			if (s)
				return Observable.create(observer => {
					observer.next(s);
					observer.complete();
				});
			else {
				return this.makeRequest(`stn.aspx`, [`cmd=stns`]).map(res => {
					this._idb.then(db => {
						var tx = db.transaction('stations', 'readwrite');
						var stationsStore = tx.objectStore('stations');
						stationsStore.put(res, 'stations');
						return tx.complete;
					});
					return res;
				});
			}
		}))
	}

	getSchedule(orig = 'woak', dest = `mont`) {		
		return Observable.fromPromise(this._idb.then(db => {
			var tx = db.transaction('schedule');
			var scheduleStore = tx.objectStore('schedule');
			return scheduleStore.get(`${orig}-${dest}`);
		}).then(s => {
			if (s)
				return Observable.create(observer => {
					observer.next(s);
					observer.complete();
				});
			else {
				return this.makeRequest(`sched.aspx`, [`cmd=depart`, `orig=${orig}`, `dest=${dest}`, `date=now`, `b=4`, `a=4`, `l=1`]).map(res => {
					this._idb.then(db => {
						var tx = db.transaction('schedule', 'readwrite');
						var scheduleStore = tx.objectStore('schedule');
						scheduleStore.put(res, `${orig}-${dest}`);
						return tx.complete;
					});
					return res;
				});
			}
		}))
	}
}

export var ServiceInjectables: Array<any> = [
	{ provide: ApiService, useClass: ApiService }
]