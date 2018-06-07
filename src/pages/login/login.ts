import { Component } from '@angular/core';
import { NavController, MenuController,AlertController, LoadingController, Events } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { ListPage } from '../list/list';
import { RegisterPage } from '../register/register';
import { DatePipe } from '@angular/common';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { OneSignal } from '@ionic-native/onesignal';

import { ViewChild } from '@angular/core';
import { Navbar } from 'ionic-angular';
import { HomePage } from '../home/home'

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  @ViewChild(Navbar) navBar: Navbar;
  registrationForm:any;
  items:any;
  login:any;
  http:any;
  device_details:any;
  hash:any;
  constructor(public menu: MenuController,
              public datepipe: DatePipe,
              public onesignal: OneSignal,
              private events: Events, 
              private loadingCtrl:LoadingController,
              public network: NetworkServiceProvider,
              private navCtrl: NavController, 
              private form: FormBuilder, http: Http, 
              private alertCtrl: AlertController, public storage: Storage) {
              this.menu.enable(false)
              this.registrationForm = this.form.group({
              "email":["", Validators.required],
              "password":["",Validators.required]
            })
            this.http = http;      
            let current_date:any = new Date();
            let f_date = this.datepipe.transform(current_date,'yyyy-MM-ddTHH:mm:ssZ')
            let ff_date = f_date.split('.')
  }

ionViewDidLoad() {
    this.navBar.backButtonClick = (e:UIEvent)=>{     
     this.navCtrl.push(HomePage)
    }
  }

loginForm(){
  if(this.network.noConnection()){
      this.network.showNetworkAlert()
        }else{  
          this.items = this.registrationForm.value;
          let body = JSON.stringify({
            email: this.items.email,
            password: this.items.password
          });
          this.storage.get('Hash').then((hash) => {
            this.hash = hash
              let headers = new Headers({
              'Content-Type': 'application/json',
              'Authorization': hash
            });
            let options = new RequestOptions({ headers: headers });
            this.http
                .post('http://www.forehotels.com:3000/api/hotel_auth', body, options)
                .subscribe(
                    data => {
                      console.log('1'+data);

                      this.login = JSON.stringify(data._body);
                      console.log('2'+this.login);
                      if(this.login.length > 0) {
                      this.storage.set('id', this.login["0"].id);
                      this.storage.set('loggedIn', true);
                      this.events.publish('user:loggedIn', this.login["0"].id);
                      this.updateCurrentDate();
                      this.onesignal.getIds().then(data => {
                      let onesignalbody = JSON.stringify({
                          device_id: data.userId,
                          id: this.login["0"].id
                        });
                      let headers = new Headers({
                        'Content-Type': 'application/json',
                        'Authorization': hash
                      });
                      let options = new RequestOptions({ headers: headers });
                      this.http
                          .put('http://www.forehotels.com:3000/api/device_id', onesignalbody, options)
                          .subscribe(
                              data => {
                                this.device_details = data.json();
                              });
                      });
                      let loading = this.loadingCtrl.create({
                                    spinner: 'bubbles',
                                    content: 'Fetching your Account Details...'
                                  });

                                  loading.present();
                                  setTimeout(() => {
                                    loading.dismiss();
                                    this.navCtrl.setRoot(ListPage);
                                  }, 2000);
                      }
                      else {
                        let alert = this.alertCtrl.create({
                        title: 'Invalid Credentials!',
                        subTitle: 'The email or password is incorrect.',
                        buttons: ['Retry']
                        });
                        alert.present();
                      }
                });
              });  
        }
      }
  updateCurrentDate(){  
    let current_date:any = new Date();
    let f_date = this.datepipe.transform(current_date,'yyyy-MM-ddTHH:mm:ssZ')
    this.storage.get('id').then((id) => {
      this.storage.get('Hash').then((key)=>{       
            let body = JSON.stringify({
                current_date: f_date,
                user_id: id
              })             
            let headers = new Headers({
              'Content-Type': 'application/json',
              'Authorization': key
            });
          let options = new RequestOptions({ headers: headers });
          this.http.post("http://www.forehotels.com:3000/api/pl",body,options)
            .subscribe(data =>{
            let result =JSON.parse(data._body); //Bind data to items object        
            },error=>{});
        });
      });
  }      
 registration() {
    this.navCtrl.push(RegisterPage)
    }     
 forgotPassword(){
    this.navCtrl.push(ForgotPasswordPage)
 }
}
