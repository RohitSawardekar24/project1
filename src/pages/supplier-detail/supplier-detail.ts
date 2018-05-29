import { Component } from '@angular/core';
import { Platform, NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@Component({
  selector: 'page-supplier-detail',
  templateUrl: 'supplier-detail.html'
})
export class SupplierDetailPage {
items:any;
http:any;
id:any;
  constructor(public storage: Storage,http: Http,
              public navCtrl: NavController,
              public ga: GoogleAnalytics,
              public platform: Platform,
              public network: NetworkServiceProvider,
              public navParams: NavParams) {
              this.http = http;
              this.id = navParams.get('id');
              if(this.network.noConnection()){
                this.network.showNetworkAlert()
              }else{ 
                 this.storage.get("id").then((id) => {
                 this.platform.ready().then(() => {
                  this.ga.trackEvent("Supplier Details", "Opened", "New Session Started", id, true)
                  this.ga.setAllowIDFACollection(true)
                  this.ga.setUserId(id)
                  this.ga.trackView("Supplier Details")
              });
            })
                  this.storage.get("Hash").then((val)=>{
                  let headers = new Headers({
                      'Content-Type': 'application/json',
                      'Authorization': val
                    });
                let options = new RequestOptions({ headers: headers });
                this.http.get("http://www.forehotels.com:3000/api/suppliers/"+this.id, options)
                      .subscribe(data =>{
                      this.items=JSON.parse(data._body).Users_Applied; //Bind data to items object
                      },error=>{
                          console.log(error);// Error getting the data
                      });
              });
            }  
      }
}