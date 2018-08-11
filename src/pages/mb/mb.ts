import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the MbPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mb',
  templateUrl: 'mb.html',
})
export class MbPage {

  song: any;
  botID: any;
  hasSkipped: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private socket: Socket, private zone: NgZone, private toastCtrl: ToastController, private storage: Storage) {
    this.song = this.navParams.get('song')
    this.botID = this.navParams.get('botID')
    this.hasSkipped = false;
    this.socket.on('song', (data) => {
      if(data.id == this.botID){
        this.zone.run(() => {
          this.song = data.data
          this.hasSkipped = false
        })
      }
    });
    this.socket.on('disco', (data) => {
      this.removeSocketListeners()
      this.socket.disconnect()
      this.discoToast()
      this.zone.run(() => {
        this.navCtrl.pop()
      })
    });
    this.socket.connect();
  }

  sendSkip(){
    this.hasSkipped = true
    this.storage.get('userToken').then((val) => {
      this.socket.emit("skipSong", {token: val});
    });
  }

  ionViewDidLoad() {

  }
  ionViewWillLeave() {
    this.removeSocketListeners()
  }
  discoToast() {
    let toast = this.toastCtrl.create({
      message: 'You are not connected to any voice channel with a bot',
      duration: 4000,
      position: 'top'
    });  
    toast.present();
  }
  removeSocketListeners(){
    this.socket.removeAllListeners("song");
    this.socket.removeAllListeners("disco");
  }

}
