import { Component } from '@angular/core';
import { Platform, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { EmployeeDetailPage } from '../employee-detail/employee-detail';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { UpgradePackageProvider } from '../../providers/upgrade-package/upgrade-package';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@Component({
  selector: 'page-catering-tab',
  templateUrl: 'catering-tab.html'
})
export class CateringTabPage {
http:any;
hash:any;
items:any;
resitems:any;
invalid:any;
  constructor(public storage: Storage,
              http: Http,
              public network: NetworkServiceProvider,
              public loadingCtrl: LoadingController,
              public platform: Platform,
              public ga: GoogleAnalytics,
              public upgrade: UpgradePackageProvider,
              public navCtrl: NavController, 
              public navParams: NavParams) {
              this.storage.get("id").then((id) => {
              this.platform.ready().then(() => {
                this.ga.trackEvent("Catering Tab", "Opened", "New Session Started", id, true)
                this.ga.setAllowIDFACollection(true)
                this.ga.setUserId(id)
                this.ga.trackView("Catering Tab")
              });
          })
          console.log(this.navParams.data);
              let loading = this.loadingCtrl.create({
              spinner: 'bubbles',
              content: 'Please Wait...'
            });
            loading.present()
              this.http = http;
              this.storage.get('Hash').then((hash) => {
              this.hash = hash            
              let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': this.hash
              });
              let options = new RequestOptions({ headers: headers });
              let body=JSON.stringify({
                pname: navParams.data.designation,
                c_id: navParams.data.c_id 
              });
              this.http.post("http://www.forehotels.com:3000/api/catering_users_list", body,options)
                    .subscribe((data) =>{
                      console.log(data);
                      this.items= []
                      this.resitems = JSON.parse(data._body).Jobs;
                      console.log('Catering jobs');
                      console.log(this.resitems);
                      if(this.resitems==[])
                          this.invalid=true;
                     
                      else
                      {
                      for(let i=0 ; i < this.resitems.length;  i++){                           
                        let img = this.resitems[i].profile_pic.split('/')
                        let imgpath;
                        if(img[0] == 'https:'){
                          imgpath = this.resitems[i].profile_pic;
                        }else{
                          imgpath = 'https://www.forehotels.com/public/emp/avatar/'+this.resitems[i].profile_pic;
                        }
                        this.items.push({name:this.resitems[i].name,designation:this.resitems[i].designation,experience:this.resitems[i].experience,qualification:this.resitems[i].qualification,id:this.resitems[i].id,profile_pic:imgpath})                             
                      }
                    }
                    loading.dismiss()
                    },error=>{
                        console.log(error);
                    } );
                  
                });    
  }
  employeedetail(emp){
    if(this.network.noConnection()){
        this.network.showNetworkAlert()
        }else{
          if(localStorage.getItem('status') == 'free'){
            this.upgrade.upgradepackage()
          }else{          
            this.navCtrl.push(EmployeeDetailPage, {
            emp: emp
          });    
        }
      }
    }
  }
  
