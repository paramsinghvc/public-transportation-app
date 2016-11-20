import { Component, EventEmitter } from '@angular/core';
import { Config } from './config';
import { Observable } from 'rxjs/Rx';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	config: Config = new Config();
	title = this.config.APP_TITLE;
	origHasChanged:EventEmitter<any> = new EventEmitter<any>();
	destHasChanged:EventEmitter<any> = new EventEmitter<any>();

	reloadSchedule() {
		console.log('reload');
	}

	onOriginUpdated(origin) {
		this.origHasChanged.emit(origin);
	}

	onDestUpdated(dest) {
		this.destHasChanged.emit(dest);
	}
}
