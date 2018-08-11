import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MbPage } from '../mb/mb';
import { Socket } from 'ng-socket-io';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SetupPage } from '../setup/setup';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  userPic: any;
  userName: any;

  constructor(public navCtrl: NavController, private socket: Socket, private toastCtrl: ToastController, private storage: Storage) {
    this.storage.get('userName').then((val) => {
      if(val){
        this.storage.get('userPic').then((val) => {
          this.userPic = val
        });
        this.socket.connect();
        this.userName = val
      }
      else{
        navCtrl.push(SetupPage)
      }
      
    });
    
  }
  
  selPage(page){
    switch (page) {
      case "mb":
        this.mbC()
        break;
    
      default:
        break;
    }
  }

  mbC(){
    this.socket.on('gsong', (data) => {
      this.removeSocketListeners()
      this.navCtrl.push(MbPage, {song: data.data, botID: data.id})
    });
    this.socket.on('disco', (data) => {
      console.log("Disco")
      this.discoToast()
      this.removeSocketListeners()
    });
    this.storage.get('userToken').then((val) => {
      this.socket.emit("getSong", {token: val});
    });
  }

  discoToast() {
    let toast = this.toastCtrl.create({
      message: 'You are not connected to any voice channel with a bot',
      duration: 3000,
      position: 'top'
    });  
    toast.present();
  }

  removeSocketListeners(){
    this.socket.removeAllListeners("gsong");
    this.socket.removeAllListeners("disco");
  }

}
