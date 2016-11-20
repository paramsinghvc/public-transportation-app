import { Component, OnInit, Inject, EventEmitter, Output, ViewChild } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs/Rx';
var parseString = require('xml2js').parseString;

@Component({
	selector: 'app-stations',
	templateUrl: './stations.component.html',
	styleUrls: ['./stations.component.scss']
})
export class StationsComponent implements OnInit {

	@Output() originChanged = new EventEmitter();
	@Output() destChanged = new EventEmitter();

	stations: Array<any>;
	constructor( @Inject(ApiService) private ApiService: any) {
		this.stations = [];
	}

	ngOnInit() {
		this.ApiService.getStations().subscribe((result) => {
			result.subscribe(res => {
				parseString(res, (err, r) => {
					this.stations = r.root.stations[0].station;
					console.log(this.stations);
				})
			})
		})
	}

	onSourceChanged(newSource) {
		// console.log(newSource);
		this.originChanged.emit(newSource);
	}

	onDestinationChanged(newDest) {
		this.destChanged.emit(newDest);
	}

}
