import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginModule } from '../Components/login/login.module';
import { ApiService } from './api.service';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { HomeModule } from '../Components/home/home.module';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { PopupComponent } from '../Components/popup/popup.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    PopupComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    LoginModule,
    HttpClientModule,
    MatDialogModule,
    HomeModule,
  ],
  providers: [
    provideClientHydration(),
    ApiService,
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
