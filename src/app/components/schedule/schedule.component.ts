import { Component, OnInit, Inject, Input, EventEmitter, Output } from '@angular/core';
import { ApiService } from '../../services/api.service';
var parseString = require('xml2js').parseString;
import { Observable } from 'rxjs/Rx';

@Component({
	selector: 'app-schedule',
	templateUrl: './schedule.component.html',
	styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
	@Input() originHasChanged: EventEmitter<any>;
	@Input() destHasChanged: EventEmitter<any>;
	selectedOrig: string = 'WOAK';
	selectedDest: string = 'MONT';
	schedule: Array<any>;
	fare: string;
	duration: string;
	constructor( @Inject(ApiService) private ApiService) {

	}
	loadSched(origin, dest) {
		this.ApiService.getSchedule(origin, dest).subscribe(result => {
			result.subscribe(res => {
				parseString(res, (err, r) => {
					console.log(r);
					this.schedule = r.root.schedule[0].request[0].trip.map(t => {
						return {
							origTime: t.$.origTimeMin,
							destTime: t.$.destTimeMin
						}
					})
					this.fare = r.root.schedule[0].request[0].trip[0].$.fare;
					this.duration = r.root.schedule[0].request[0].trip[0].$.tripTime;
					console.log(this.schedule);
				})
			})
		})
	}
	ngOnInit() {
		this.loadSched(this.selectedOrig, this.selectedDest);
		this.originHasChanged && this.originHasChanged.subscribe(res => {
			this.selectedOrig = res;
			this.loadSched(res, this.selectedDest);
		})
		this.destHasChanged && this.destHasChanged.subscribe(res => {
			console.log(res);
			this.selectedDest = res;
			this.loadSched(this.selectedOrig, res);
		})
	}

}
