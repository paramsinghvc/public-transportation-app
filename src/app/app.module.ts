import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { StationsComponent } from './components/stations/stations.component';
import { ApiService } from './services/api.service';
import { ScheduleComponent } from './components/schedule/schedule.component';

@NgModule({
  declarations: [
    AppComponent,
    StationsComponent,
    ScheduleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
