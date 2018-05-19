import { Component } from '@angular/core';
import { Platform, NavController, NavParams, MenuController } from 'ionic-angular';
import { PrivacyPolicyPage } from '../privacy-policy/privacy-policy';
import { TermsConditionsPage } from '../terms-conditions/terms-conditions';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Storage } from '@ionic/storage';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';

@Component({
  selector: 'page-about-us',
  templateUrl: 'about-us.html',
})
export class AboutUsPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public network: NetworkServiceProvider,
              public menu: MenuController, 
              private platform: Platform,
              private ga: GoogleAnalytics,
              private storage: Storage) {
              this.storage.get("id").then((id) => {
              this.platform.ready().then(() => {
                this.ga.trackEvent("About Us", "Opened", "New Session Started", id, true)
                this.ga.setAllowIDFACollection(true)
                this.ga.setUserId(id)
                this.ga.trackView("About Us")
            });
          })                   
  }
  privacypolicy(){
    if(this.network.noConnection()){
       this.network.showNetworkAlert()
    }else{
       this.navCtrl.push(PrivacyPolicyPage)
    }
  }

  termsconditions(){
    if(this.network.noConnection()){
       this.network.showNetworkAlert()
      }else{
        this.navCtrl.push(TermsConditionsPage)
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutUsPage');
  }

}
