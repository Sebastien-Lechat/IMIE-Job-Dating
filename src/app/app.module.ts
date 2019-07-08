import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { File } from '@ionic-native/file/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import{ HttpClientModule } from '@angular/common/http';
import { NativeStorage } from '@ionic-native/native-storage/ngx';




import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { JobPageModule } from './job/job.module';
import { ProfilModalePageModule } from './profil-modale/profil-modale.module';
import { RencontreService } from './services/rencontre/rencontre.service';




@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    JobPageModule,
    ProfilModalePageModule  
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HTTP,
    File,
    NativeStorage,
    { provide: HTTP_INTERCEPTORS, useClass: RencontreService, multi:true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
