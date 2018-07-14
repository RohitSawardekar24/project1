import { Component } from '@angular/core';
import { Platform, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { PaymentOptionsPage } from '../payment-options/payment-options';
import { Storage } from '@ionic/storage';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@Component({
  selector: 'page-package',
  templateUrl: 'package.html',
})
export class PackagePage {

		  data: Array<{amt:number;title:any;icon1:String;icon2:String;icon3:String;text1:any;text2:any;text4:any;text5:any;text7:any;text8:any;text9:any;textamt:any;textamt2:any;textamt3:any;textamt4:any}> = [];
		  http:any;
		  hash:any;
		  user:any;
		  paid:boolean;
      items:any;
      jobs:any
      interview:any
      days:any
      amount:any
  constructor(public alertCtrl: AlertController,
              public storage: Storage,
              public platform: Platform,
              public ga: GoogleAnalytics,
              public loading: LoadingController,
              public navCtrl: NavController, 
              public navParams: NavParams, http: Http) {
              this.http = http;
              let loader = this.loading.create({
                spinner: 'bubbles',
                content: 'Please Wait...'
              });
              loader.present();
    this.storage.get("id").then((id) => {
      this.storage.get("Hash").then((value) => {
        
            
              this.platform.ready().then(() => {
                this.ga.trackEvent("Package", "Opened", "New Session Started", id, true)
                this.ga.setAllowIDFACollection(true)
                this.ga.setUserId(id)
                this.ga.trackView("Package")
            });
          
        let headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': value
        });
        let options = new RequestOptions({ headers: headers });
   
         this.http.get("http://www.forehotels.com:3000/api/package/"+id, options)
            .subscribe(data =>{
             this.items=JSON.parse(data._body).Jobs;
             loader.dismiss()
             if(this.items[0].hotel_type == 'standalone'){
                 this.jobs = "5";
                 this.interview = "25";
                 this.days = "90";
                 this.amount = 4500;
             }
             console.log('Jobs '+this.jobs)
             if(this.items[0].hotel_type == 'state'){
               this.jobs = 15;
               this.interview = 75;
               this.days = 120;
               this.amount = 10000;
           }
           if(this.items[0].hotel_type == 'national'){
             this.jobs = 20;
             this.interview = 100;
             this.days = 180;
             this.amount = 15000;
         }
         if(this.items[0].hotel_type == 'international'){
           this.jobs = 25;
           this.interview = 125;
           this.days = 180;
           this.amount = 24000;
       }
           
  		this.paid = false      
        this.data.push({
         title:"Quarterly package Rs. 4500",
         icon1: 'md-arrow-dropright',
         icon2:'md-checkmark',
         icon3:"As Per Post",
         text1:"Job Posting",         
         text2:"Personal Assistance",
         text4:"Schedule Interview",
         text5:"Rank your Employee",
         text7:"Data Access",
         text8:"Supplier details",
         text9:"Time Duration",
         textamt:this.jobs,
         textamt2:this.interview,
         textamt3:"As per Post",
         textamt4:this.days+" Days",
         amt:4500
        });
     
        this.data.push({
         title:"Yearly package Rs. 45000",
         icon1: 'md-arrow-dropright',
         icon2: "md-checkmark",
         icon3:"10",
         text1:"Job Posting",
         text2:"Personal Assistance",
         text4:"Schedule Interview",
         text5:"Rank your Employee",
         text7:"Data Access",
         text8:"Supplier details",
         text9:"Time Duration",
         textamt:"12",
         textamt2:"75",
         textamt3:"N/A",
         textamt4:"1 Year",
         amt:45000
        });
      });  
    });
  });
  }

  toggleDetails(data) {
    if (data.showDetails) {
        data.showDetails = false;
        data.icon = 'ios-arrow-down-outline';
    } else {
        data.showDetails = true;
        data.icon = 'ios-arrow-up-outline';
    }
  }
  read(data){
    if(data.showDetails){
      return true;
    }
    else{
      return false;
    }
  }
  purchase(amt){
    this.navCtrl.push(PaymentOptionsPage, {
      amt: amt
    })
  }

}
