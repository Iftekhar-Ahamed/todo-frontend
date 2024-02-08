import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginModule } from '../login/login.module';
import { ApiService } from './api.service';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { HomeModule } from '../home/home.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LoginModule,
    HttpClientModule,
    MatDialogModule,
    HomeModule
  ],
  providers: [
    provideClientHydration(),
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
