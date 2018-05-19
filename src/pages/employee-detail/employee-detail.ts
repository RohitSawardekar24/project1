import { Component } from '@angular/core';
import { Platform, NavController, NavParams } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AlertController } from 'ionic-angular';
import { ScheduleInterviewPage } from '../schedule-interview/schedule-interview'
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Storage } from '@ionic/storage'
import { CallNumber } from '@ionic-native/call-number';
import { Toast } from '@ionic-native/toast';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
let checker = 0
let resitem;
@Component({
  selector: 'page-employee-detail',
  templateUrl: 'employee-detail.html'
})
export class EmployeeDetailPage {
  
items:any;
http:any;
emp:any;
hash:any
user_id:any;
color:String;
emp_id: any;
resume: any;
checkemp: any;
resume_pdf: any;
social_pic: boolean = false;
  constructor(public storage: Storage, 
              public callnumber: CallNumber ,
              private iab: InAppBrowser,
              public navCtrl: NavController, 
              public navParams: NavParams,
              public network: NetworkServiceProvider,
              public platform: Platform,
              public ga: GoogleAnalytics,
              public toast: Toast,
              private alertCtrl: AlertController, 
              http: Http) {
              this.http = http;  
              this.emp = navParams.get('emp');   
  }
ionViewDidEnter() {
    this.loaddata();
    this.color = '#1396e2'
  }
  loaddata(){
       if(this.network.noConnection()){
        this.network.showNetworkAlert()
        }else{
         this.storage.get("id").then((id) => {
              this.platform.ready().then(() => {
                this.ga.trackEvent("Employee Details", "Opened", "New Session Started", id, true)
                this.ga.setAllowIDFACollection(true)
                this.ga.setUserId(id)
                this.ga.trackView("Employee Details")
              });
          })
        this.storage.get("Hash").then((val)=>{
        this.hash = val          
                let headers = new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': val
                  });
                  let options = new RequestOptions({ headers: headers });
                  this.http.get("http://forehotels.com:3000/api/employee/"+this.emp, options)
                        .subscribe(data =>{
                          this.checkShorlisted()
                          this.items=JSON.parse(data._body).Users;
                        let img = (this.items[0].profile_pic).split('/');
                        if(img[0] == 'https:'){
                          this.social_pic = true;
                        }
                          this.resume = this.items[0].resume;
                          this.resume_pdf = this.resume.split('.')
                        },error=>{
                            console.log(error);// Error getting the data
                        });              
          });  
        }
  }
  checkShorlisted(){
        this.storage.get("id").then((id)=>{
          this.storage.get("Hash").then((value)=>{
          let body = JSON.stringify({
            user_id: id,
            emp_id: this.emp 
          });
          let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': value
          });
          let options = new RequestOptions({ headers: headers });
          this.http.get("http://forehotels.com:3000/api/shortlisted_employee/"+id, options)
          .subscribe(data =>{
            this.checkemp=JSON.parse(data._body).Users; //Bind data to items object
            for(resitem of this.checkemp){
              if(resitem.id == this.emp){            
                this.color = "#f2a900"
            }
          }
          
        });
      });
    });
  }
  call(number){
      this.callnumber.callNumber("+91"+number,true)
  }
  downloadCV(){
     if(this.network.noConnection()){
        this.network.showNetworkAlert()
        }else{
            this.storage.get("Hash").then((hash)=>{
            this.storage.get("id").then((id)=>{
            let body = JSON.stringify({
              user_id: id,
              emp_id: this.emp 
            });
            let headers = new Headers({
              'Content-Type': 'application/json',
              'Authorization': hash
            });
            let options = new RequestOptions({ headers: headers });
            this.http
                .post('http://forehotels.com:3000/api/cv', body, options)
                .subscribe(
                    data => {
                    },
                  );
                })
            }) 
            if(this.resume == 'created'){   
            let url = "https://www.forehotels.com/registration/cv_preview/"+this.emp;
            let browser = this.iab.create(encodeURI(url), '_blank', "location=no, clearsessioncache=yes, clearcache=yes, hidden=yes");
            browser.on("loadstop")
                        .subscribe(
                            () => {
                              browser.show();
                            },
                            err => {
                              console.log("InAppBrowser Loadstop Event Error: " + err);
                            });
            }  
            else{
              if(this.resume_pdf[1] == 'pdf'){
                  let url = "https://docs.google.com/gview?embedded=true&url=https://www.forehotels.com/public/emp/tmp_uploads/"+this.resume;
                let browser = this.iab.create(encodeURI(url), '_blank', "location=no, clearsessioncache=yes, clearcache=yes, hidden=yes");
              browser.on("loadstop")
                          .subscribe(
                              () => {
                                browser.show();
                              },
                              err => {
                                console.log("InAppBrowser Loadstop Event Error: " + err);
                              });

              }else{
              let url = "https://view.officeapps.live.com/op/embed.aspx?src=https://www.forehotels.com/public/emp/tmp_uploads/"+this.resume;
              let browser = this.iab.create(encodeURI(url), '_blank', "location=no, clearsessioncache=yes, clearcache=yes, hidden=yes");
            browser.on("loadstop")
                        .subscribe(
                            () => {
                              browser.show();
                            },
                            err => {
                              console.log("InAppBrowser Loadstop Event Error: " + err);
                            });
              }
            }
        }
  } 
  shortlist(){
     if(this.network.noConnection()){
        this.network.showNetworkAlert()
        }else{    
            this.storage.get("id").then((id)=>{
            this.storage.get("Hash").then((value)=>{
            this.checkShorlisted();
            for(resitem of this.checkemp){
              if(resitem.id == this.emp){
                checker = 1
                }
              }
            if(checker == 1){
              this.toast.show(`Candidate already shortlisted`, '5000', 'bottom').subscribe(
                toast => {
                  console.log(toast);
                });
            }else{
                let body = JSON.stringify({
                  user_id: id,
                  emp_id: this.emp 
                });
                let headers = new Headers({
                  'Content-Type': 'application/json',
                  'Authorization': value
                });
                let options = new RequestOptions({ headers: headers });
                this.http
                    .post('http://forehotels.com:3000/api/emp_wishlist', body, options)
                    .map(res => res.json())
                    .subscribe(
                        data => {
                          this.color = "#f2a900"
                          console.log(data);
                          let alert = this.alertCtrl.create({
                            title: 'Congrats!',
                            subTitle: 'Candidate Shortlisted Successfully.',
                            buttons: [{
                                text: 'OK',
                                role: 'cancel',
                                handler: () => {
                                  console.log('Cancel clicked');
                                }
                              },
                              {
                                text: 'Schedule Interview',
                                handler: () => {
                                  this.navCtrl.push(ScheduleInterviewPage)
                                }
                              }]
                          });
                            alert.present();
                        });
                  }
              });    
          }); 
      }
  }  
}