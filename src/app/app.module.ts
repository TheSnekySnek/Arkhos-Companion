import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
const config: SocketIoConfig = { url: 'http://dash.arkhos.net:1337', options: {} };

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MbPage } from '../pages/mb/mb';
import { SetupPage } from '../pages/setup/setup';
import { ScannerPage } from '../pages/scanner/scanner';
import { IonicStorageModule } from '@ionic/storage';
import { QRScanner } from '@ionic-native/qr-scanner';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MbPage,
    SetupPage,
    ScannerPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    SocketIoModule.forRoot(config),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MbPage,
    SetupPage,
    ScannerPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    QRScanner
  ]
})
export class AppModule {}
