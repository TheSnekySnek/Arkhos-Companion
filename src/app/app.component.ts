import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { HomePage } from '../pages/home/home';
import { SetupPage } from '../pages/setup/setup';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private storage: Storage) {
    this.storage.get('userName').then((val) => {
      if(!val){
        this.rootPage = SetupPage
      }
      else{
        this.rootPage = HomePage
        /*this.storage.remove("userName")
        this.storage.remove("userToken")
        this.storage.remove("userPic")*/
        
      }
      platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        //this.storage.set('userName', 'TheSnekySnek');
        //this.storage.set('userToken', 'fa014d77-eb50-4f74-953a-bed5cd85051e');
        //this.storage.set('userPic', 'https://cdn.discordapp.com/avatars/83519111514034176/a_deaef98aba16570a3fda53355838e20d.gif');
        statusBar.styleDefault();
        splashScreen.hide();
      });
    });
    
  }
}

