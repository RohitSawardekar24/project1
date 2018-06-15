import { Component } from '@angular/core';
import { Platform, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Toast } from '@ionic-native/toast';
import { Storage } from '@ionic/storage';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html'
})
export class ForgotPasswordPage {
   emailForm:any;
   items:any;
   http:any;
   login:any;
   smsForm:any;
   checkusers:any;
   checkcontact:any;
   temppass:string;
  constructor(public loadingCtrl: LoadingController,
              public toast: Toast, 
              public storage: Storage,http: Http,
              public navCtrl: NavController, 
              public navParams: NavParams,
              public platform: Platform,
              public ga: GoogleAnalytics,
              public network: NetworkServiceProvider, 
              private form: FormBuilder, 
              public alertCtrl: AlertController) {
              this.storage.get("id").then((id) => {
              this.platform.ready().then(() => {
                this.ga.trackEvent("Forgot Password", "Opened", "New Session Started", id, true)
                this.ga.setAllowIDFACollection(true)
                this.ga.setUserId(id)
                this.ga.trackView("Forgot Password")
            });
          })              
              this.emailForm = this.form.group({
                "email":["", Validators.required]
              })            
              this.smsForm = this.form.group({
                "contact_no":["", Validators.required]
              })
            this.http = http;
  }
    emailCheck(){
      if(this.network.noConnection()){
           this.network.showNetworkAlert()
        }else{  
            this.storage.get("Hash").then((hash)=>{
            let loading = this.loadingCtrl.create({
              spinner: 'bubbles',
              content: 'Please Wait..'
            })
            loading.present();
            var applied = false;
            this.items = this.emailForm.value;    //YOGESH!!!!!!!!!! THIS TAKES VALUE FROM FORM
            let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': hash
          });                 
          
          let body = JSON.stringify({
          email: this.items.email,
          });
          let options = new RequestOptions({ headers: headers });
          this.http.get("http://www.forehotels.com:3000/api/hotel_users", options)
                  .subscribe(data =>{
                    loading.dismiss()
                  this.checkusers=JSON.parse(data._body).Users;//Bind data to items object
                  let checker = 0;
                  for(let item of this.checkusers ){
                      if(item.email == this.items.email){
                      checker = 1;
                      }
                    }
                    if(checker == 1){
                    let email_body = JSON.stringify({
                    email: this.items.email,
                    mail: 'forgot_password'
                  });
                  let headers1 = new Headers({
                  'Content-Type': "application/json",
                  'Authorization': hash
                });
                let options1 = new RequestOptions({ headers: headers1 });
                    this.http
                      .post('https://www.forehotels.com/alerts/send_email', email_body, options1)
                      .subscribe(
                          data => {
                        this.toast.show("A Mail has been sent to your Email ID", '7000', 'bottom').subscribe(
                            toast => {
                              console.log(toast);
                            }
                          );
                        });
                    }
                    else{
                      let alerts = this.alertCtrl.create({
                      title: 'Oops..!!',
                      subTitle: 'Email ID doesnt exists.',
                      buttons: ['OK']
                      });
                      alerts.present();
                    }
                    
                  },error=>{
                      console.log(error);// Error getting the data
                  } );
                });
        }    
    }
    smsCheck(){
      if(this.network.noConnection()){
           this.network.showNetworkAlert()
        }else{  
            this.storage.get("Hash").then((hash)=>{
            let loading = this.loadingCtrl.create({
              spinner: 'bubbles',
              content: 'Please Wait..'
            })
            loading.present();
            this.items = this.smsForm.value;
          
          let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': hash
          });                 
          
          let sms_body = JSON.stringify({
          number: this.items.contact_no,
          text : 'forgot_password'
          });
          let options = new RequestOptions({ headers: headers });
          this.http.get("http://www.forehotels.com:3000/api/hotel_users", options)
                  .subscribe(data =>{
                  this.checkcontact=JSON.parse(data._body).Users;//Bind data to items object
                  let user;
                  let checker = 0;
                  for(let item of this.checkcontact){
                      if(item.hr_number == this.items.contact_no){
                      checker = 1;
                      user=item;
                      }
                    }
                    if(checker == 1){
                       this.temppass='abcdfeiqurshjcoauspwtydiagdrtsqplskj';
                      let start=Math.floor(Math.random()*(this.temppass.length-5));
                      let end=start+5;
                      this.temppass=this.temppass.slice(start,end);
                      let sms_body = JSON.stringify({
                        number: this.items.contact_no,
                        text: 'Hi '+ user.name+' your new password is: '+this.temppass
                        });
                        console.log('1');
                  this.http
                  .post('http://www.forehotels.com:3000/api/send_sms', sms_body, options)
                  .subscribe(
                      data => {
                        console.log('2');
                        loading.dismiss();
                    this.toast.show("New password Sent to your Phone Number", '7000', 'bottom').subscribe(
                            toast => {
                              console.log("Toast Display");
                            }
                          );
                        },
                      err=>console.log(err));
                        let pass=JSON.stringify({
                          password:this.temppass,
                          id:user.user_id                          
                        
                        });
                        console.log('3');
                        this.http.put('http://forehotels.com:3000/api/forgot_password',pass,options)
                        .subscribe(
                          data=>{
                            console.log('4');
                            console.log('success');
                  
                        }
                            ,
                          err=>console.log('error')
                        );
                        console.log('5');
                        this.navCtrl.push(LoginPage);
                      }
                    else{
                      let alerts = this.alertCtrl.create({
                      title: 'Oops',
                      subTitle: 'Phone Number doesnt exists.',
                      buttons: ['OK']
                      });
                      alerts.present();
                    }
                  },error=>{
                      console.log(error);// Error getting the data
                  } );
              }) 
        }    
    }    
            
}
