import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Socket } from 'ng-socket-io';
import { HomePage } from '../home/home';

/**
 * Generated class for the ScannerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-scanner',
  templateUrl: 'scanner.html',
})
export class ScannerPage {

  canLeave: any = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private qrScanner: QRScanner, private toastCtrl: ToastController, private storage: Storage, private socket: Socket) {
    this.socket.on("connect_error", (e) =>{
      let toast = this.toastCtrl.create({
        message: 'Can connect to server. Please try again later.',
        duration: 3000,
        position: 'top'
      });  
      toast.present();
      this.socket.removeAllListeners("connect_error")
      this.canLeave = true
      this.navCtrl.pop()
      
    })
    this.socket.connect()
    this.qrScanner.prepare()
    .then((status: QRScannerStatus) => {
      if (status.authorized) {
        // camera permission was granted
        let toast = this.toastCtrl.create({
          message: 'Auth',
          duration: 3000,
          position: 'top'
        });  
        toast.present();

        // start scanning
        
        let scanSub = this.qrScanner.scan().subscribe((text: string) => {

          this.qrScanner.hide(); // hide camera preview
          scanSub.unsubscribe(); // stop scanning
          this.storage.set('userToken', text)
          this.getUser(text)
        });
        this.qrScanner.show()
      } else if (status.denied) {
        qrScanner.openSettings()
      } else {
        let toast = this.toastCtrl.create({
          message: 'DENIED',
          duration: 3000,
          position: 'top'
        });  
        toast.present();
        // permission was denied, but not permanently. You can ask for permission again at a later time.
      }
    })
    .catch((e: any) => console.log('Error is', e));
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScannerPage');
  }
  ionViewCanLeave() {
    return this.canLeave
  }

  getUser(token){
    this.socket.on('userInfo', (data) => {
      this.socket.removeAllListeners('userInfo')
      this.socket.removeAllListeners('invalidUser')
      this.socket.removeAllListeners("connect_error")
      this.socket.disconnect()
      this.storage.set('userName', data.name)
      this.storage.set('userPic', data.pic)
      this.canLeave = true
      this.navCtrl.setRoot(HomePage);
    });
    this.socket.on('invalidUser', (data) => {
      let toast = this.toastCtrl.create({
        message: 'Invalid User',
        duration: 3000,
        position: 'top'
      });  
      toast.present();
      this.socket.removeAllListeners('userInfo')
      this.socket.removeAllListeners('invalidUser')
      this.socket.removeAllListeners("connect_error")
      this.socket.disconnect()
      this.canLeave = true
      this.navCtrl.pop()
    });
    this.socket.emit("getUserInfo", {token: token});
  }
  

}
