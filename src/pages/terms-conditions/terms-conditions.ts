import { Component } from '@angular/core';
import { NavController, NavParams, MenuController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';

@Component({
  selector: 'page-terms-conditions',
  templateUrl: 'terms-conditions.html',
})
export class TermsConditionsPage {
items:any
  http:any
  constructor(public menu: MenuController,public storage: Storage,http: Http,public network: NetworkServiceProvider) {
    this.http = http
    if(this.network.noConnection()){
       this.network.showNetworkAlert()
       }else{
            this.storage.get("Hash").then((hash)=>{
            let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': hash
              });
              let options = new RequestOptions({ headers: headers });
              this.http
                  .get('http://localhost:3000/api/config', options)
                  .subscribe(
                      data => {                          
                        this.items = JSON.parse(data._body);
                        this.items= this.items[2].cnf_desc
                      })
            })
        }
  }
  
}
