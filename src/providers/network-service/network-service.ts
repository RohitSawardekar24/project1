import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ToastController } from 'ionic-angular'
import { Network } from '@ionic-native/network'
import 'rxjs/add/operator/map';

/*
  Generated class for the NetworkServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class NetworkServiceProvider {

  constructor(public http: Http,public network: Network,public toastCtrl: ToastController) {
    console.log('Hello NetworkServiceProvider Provider');
  }

  public noConnection() {
  return(this.network.type === 'none')
  }
      showNetworkAlert() {
          let toast = this.toastCtrl.create({
          message: 'Failed to connect to Forehotels, check your internet connection',
          duration: 15000,
          position: 'bottom',
          showCloseButton: true,
          closeButtonText: 'Got it!',
          cssClass: "redClass"
        });
        toast.present();
      }

}
