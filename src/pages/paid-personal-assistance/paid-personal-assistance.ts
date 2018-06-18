import { Component } from '@angular/core';
import { Platform, NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Toast } from '@ionic-native/toast';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

/**
 * Generated class for the PaidPersonalAssistancePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-paid-personal-assistance',
  templateUrl: 'paid-personal-assistance.html',
})
export class PaidPersonalAssistancePage {
  http: any;
  items: any;
  list: any=[];
  length: any;
  constructor(public navCtrl: NavController,
              public network: NetworkServiceProvider,
              public ga: GoogleAnalytics,
              public platform: Platform,
              http: Http,
              public storage: Storage, 
              public navParams: NavParams) {
                this.http=http;
                this.loadData();
  }
              
  loadData(){
    if(this.network.noConnection()){
       this.network.showNetworkAlert()
      }else{ 
          this.storage.get("id").then((id)=>{
          this.storage.get("Hash").then((value)=>{
          this.platform.ready().then(() => {
                this.ga.trackEvent("Paid Personal Assistance", "Opened", "New Session Started", id, true)
                this.ga.setAllowIDFACollection(true)
                this.ga.setUserId(id)
                this.ga.trackView("Paid Personal Assistance")
          })
          let headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': value
        });
        let options = new RequestOptions({ headers: headers });
          this.http.get("http://www.forehotels.com:3000/api/job_posted/"+id, options)
                .subscribe(data =>{
                this.items=JSON.parse(data._body).Jobs; //Bind data to items object
                for(let response of this.items){
                  if(response.paid == 1){                   
                   this.list.push(response)                  
                  }
                }
                this.length = this.list.length;
              },error=>{
              });
            })
        })
    }
  }
}
