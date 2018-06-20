import { Component } from '@angular/core';
import { Platform, Events, NavParams ,NavController, ModalController, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { EmployeeDetailPage } from '../employee-detail/employee-detail';
import { FormControl } from '@angular/forms';
import { Designation } from '../../providers/designation/designation';
import { PackagePage } from '../package/package';
import { City } from '../../providers/city/city';
import 'rxjs/add/operator/debounceTime';
import { UpgradePackageProvider } from '../../providers/upgrade-package/upgrade-package';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@Component({
  selector: 'page-employee-tab',
  templateUrl: 'employee-tab.html'
})
export class EmployeeTabPage {
  items=[];
  resitems:any;
  http:any;
  hash:any;
  modal:any;
  data:any;
  count:number=30
  length:any
  item:any
  final_count:any
  emp_count:any
  social_pic: any
  c_id:any
  fb:any
  designation:any
  mera_picture:any
  constructor(public upgrade:UpgradePackageProvider,
              public events: Events, 
              public alertCtrl: AlertController,
              public navParams: NavParams,
              public platform: Platform,
              public ga: GoogleAnalytics,
              public storage: Storage, 
              public loadingCtrl: LoadingController,
              public network: NetworkServiceProvider,
              public modalCtrl: ModalController,http: Http,
              public navCtrl: NavController) {
      if(this.network.noConnection()){
       this.network.showNetworkAlert()
      }else{ 
        this.storage.get("id").then((id) => {
              this.platform.ready().then(() => {
                this.ga.trackEvent("Employee Tab", "Opened", "New Session Started", id, true)
                this.ga.setAllowIDFACollection(true)
                this.ga.setUserId(id)
                this.ga.trackView("Employee Tab")
              });
          })
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Fetching Candidates Details...'
    });
    loading.present();
    this.storage.get("Hash").then((value) => {
    this.hash = value
    this.http = http;
    
          let body={
            pname: navParams.data.designation,
            c_id: navParams.data.c_id 
          }
          let headers = new Headers({
              'Content-Type': 'application/json',
              'Authorization': this.hash
            });
            let options = new RequestOptions({ headers: headers });
            this.http.post("http://www.forehotels.com:3000/api/users_list", body ,options)
                  .subscribe(data =>{
                    this.items= []
                  this.resitems = JSON.parse(data._body).Users;          
                  this.emp_count = this.resitems.length
                  this.events.publish('emp_length',this.resitems.length)
                  if(this.resitems.length < 30){
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
                    }else{
                      for(let i=0 ; i < 30;  i++){ 
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
                  });          
          })
      }
    }
  doInfinite(infiniteScroll) {
    if(this.network.noConnection()){
           this.network.showNetworkAlert()
      }else{ 
        var itemlen;
        var total = itemlen - this.resitems.length    
              setTimeout(() => {
                  if(this.count >= this.resitems.length){  
                    for (let i = itemlen; i < this.resitems.length; i++) {
                        let img = this.resitems[i].profile_pic.split('/')
                        let imgpath;
                        if(img[0] == 'https:'){
                          imgpath = this.resitems[i].profile_pic;
                        }else{
                          imgpath = 'https://www.forehotels.com/public/emp/avatar/'+this.resitems[i].profile_pic;
                        }
                        this.items.push({name:this.resitems[i].name,designation:this.resitems[i].designation,experience:this.resitems[i].experience,qualification:this.resitems[i].qualification,id:this.resitems[i].id,profile_pic:imgpath})
                      }
                    }else{
                      for(let i= this.count; i < (this.count+30); i++){
                        let img = this.resitems[i].profile_pic.split('/')
                        let imgpath;
                        if(img[0] == 'https:'){
                          imgpath = this.resitems[i].profile_pic;
                        }else{
                          imgpath = 'https://www.forehotels.com/public/emp/avatar/'+this.resitems[i].profile_pic;
                        }
                        this.items.push({name:this.resitems[i].name,designation:this.resitems[i].designation,experience:this.resitems[i].experience,qualification:this.resitems[i].qualification,id:this.resitems[i].id,profile_pic:imgpath})
                      }
                      itemlen = Object.keys(this.items).length                  
                    }
                    this.count += 30
                infiniteScroll.complete();
              }, 500);  
      }    
  }
  employeedetail(emp){
    if(this.network.noConnection()){
       this.network.showNetworkAlert()
      }else{
          if(window.localStorage.getItem('status') == 'free'){
            this.upgrade.upgradepackage()
          }else{
            if(this.network.noConnection()){
              this.network.showNetworkAlert()
              }else{ 
                  this.navCtrl.push(EmployeeDetailPage, {
                  emp: emp
                });
            }
        }
    }
}
searchEmployee(){
  if(this.network.noConnection()){
     this.network.showNetworkAlert()
    }else{ 
          let body;
            if(this.data!=null || this.data != undefined){
              this.modal = this.modalCtrl.create(SearchEmployeePage, {
                days:this.data.days,
                pname:this.data.pname,
                c_id:this.data.c_id,
                city_id:this.data.city_id,
                city_name: this.data.city_name,
                experience:this.data.experience,
              });
          }else{
              this.modal = this.modalCtrl.create(SearchEmployeePage)
            }
            this.modal.onDidDismiss(data => {
            let loader = this.loadingCtrl.create({
              spinner: "bubbles",
              content: "Please wait...",
            });
            this.data = data
            loader.present();
            this.storage.get("Hash").then((hash)=>{
              if(data == null || data == undefined){
                    body={}
                  }else{
                    body = {
                      days: data.days,
                      pname:data.pname,
                      c_id:data.c_id,
                      city_id:data.city_id,
                      city_name:data.city_name,
                      experience:data.experience,
                    };
              }
              let headers = new Headers({
              'Content-Type': 'application/json',
              'Authorization': hash
            });
            let options = new RequestOptions({ headers: headers });
            this.http
                .post('http://www.forehotels.com:3000/api/users_list', body, options)
                .subscribe(
                    data => {
                      this.items.splice(0,this.items.length)
                      this.resitems = JSON.parse(data._body).Users;
                      this.emp_count = this.resitems.length
                        this.events.publish('emp_length',this.resitems.length)
                        for(let i = 0; i < this.resitems.length; i++){
                          let img = this.resitems[i].profile_pic.split('/')
                          let imgpath;
                          if(img[0] == 'https:'){
                            imgpath = this.resitems[i].profile_pic;
                          }else{
                            imgpath = 'https://www.forehotels.com/public/emp/avatar/'+this.resitems[i].profile_pic;
                          }
                          this.items.push({name:this.resitems[i].name,designation:this.resitems[i].designation,experience:this.resitems[i].experience,qualification:this.resitems[i].qualification,id:this.resitems[i].id,profile_pic:imgpath})
                          }
                        loader.dismiss();
                },
                    err => {
                      console.log("ERROR!: ", err);
                    }
                );
              });
          });
            this.modal.present();
    }
  }
}
@Component({
  template: `
<style>
 #footer {   
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: transparent;
    box-shadow: none;
}
#footerbtn {
    background: #0070FF;
    text-align: center;    
    z-index:1000;
    font-size: 18px;
    font-family: sans-serif;
    font-weight: bold;
    width: 100%;
    height: 2em;  
}
.bar-button-clear-ios, .bar-button-default.bar-button-ios-clear, .bar-button-clear-ios-clear{
  color: black;
}

ion-grid{
  padding: 0px !important;
}
ion-scroll {
    white-space: nowrap;
    height: 1000px;
  }
  .ion-label{
    white-space: normal;
  }
</style>
  <ion-header>
  <ion-toolbar>
    <ion-buttons start>
      <button ion-button clear (click)="dismiss()" >x</button>
    </ion-buttons>
    <ion-title>Filter</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
<ion-row style="height:100%">
<ion-col width-33 style="color:black;background-color:#fff;height: 100%;white-space:pre-wrap">
    <ion-list>
      <button style="white-space:pre-wrap" ion-item *ngFor="let p of filters" (click)="setActive(p.id)" [style.background-color]="getStyle(p.id)">
        {{p.title}}
     </button>
    </ion-list>
 </ion-col>
 <ion-col width-67 style="color:black;background-color:white;height: 100%;">
  <div *ngIf="this.filters[0].active == true">
  <ion-card style="display: flex;">
   <ion-icon style="font-size: 2.2em;padding: 5%;" name="search"></ion-icon>
     <ion-input class="searchinput" [(ngModel)]="searchTerm" [formControl]="searchControl" value="{{this.pname}}" placeholder="Search" (ionInput)="onSearchInput()" ></ion-input>
     </ion-card>
            <ion-item>
       <div *ngIf="searching" class="spinner-container">
        <ion-spinner></ion-spinner>
       </div>
    <ion-scroll scrollY="true">
    <ion-list>
        <ion-item *ngFor="let item of this.post" (click)="onclick(item)">
            {{item.designation}}
        </ion-item>
    </ion-list>
    </ion-scroll>
  </ion-item>
    </div>
    
    <!--For City-->
    <div *ngIf="this.filters[1].active == true">
    <ion-card style="display: flex;">
      <ion-icon style="font-size: 2.2em;padding: 5%;" name="search"></ion-icon>
      <ion-input [(ngModel)]="searchCity" [formControl]="searchCityControl" value="{{this.city_name}}" placeholder="Search" (ionInput)="onSearchCity()"></ion-input>
    </ion-card>
            <ion-item>
       <div *ngIf="searching" class="spinner-container">
        <ion-spinner></ion-spinner>
       </div>
    <ion-scroll scrollY="true">
    <ion-list>
        <ion-item *ngFor="let item of this.cities" (click)="onClickCity(item)">
            {{item.city_name}}
        </ion-item>
    </ion-list>
    </ion-scroll>
  </ion-item>
     </div>
    <!--For Exp-->
    <div *ngIf="this.filters[2].active == true" (click)="selectExp()">
          <ion-list radio-group name="exp">
      <ion-item>
      <ion-label>Fresher</ion-label>
        <ion-radio (click)="exp_checker(0)" [checked]="0 == this.experience"></ion-radio>
      </ion-item>
      <ion-item *ngFor="let i of exp">
      <ion-label>{{i}}</ion-label>
        <ion-radio (click)="exp_checker(i)" [checked]="i == this.experience"></ion-radio>
      </ion-item>
          </ion-list>
     </div>
     <!--Recent Login-->
     <div *ngIf="this.filters[3].active == true">
      <ion-list radio-group name="login">
      <ion-item>
      <ion-label>In last 7 days</ion-label>
        <ion-radio (click)="login(7)" [checked]="this.checked_login == 7"></ion-radio>
      </ion-item>
      <ion-item>
      <ion-label style="white-space:pre-wrap">In last 14 days</ion-label>
        <ion-radio (click)="login(14)" [checked]="this.checked_login == 14"></ion-radio>
      </ion-item>
      <ion-item>
      <ion-label style="white-space:pre-wrap">In last 1 month</ion-label>
        <ion-radio (click)="login(30)" [checked]="this.checked_login == 30"></ion-radio>
      </ion-item>
      <ion-item>
      <ion-label style="white-space:pre-wrap">In last 3 month</ion-label>
        <ion-radio (click)="login(90)" [checked]="this.checked_login == 90"></ion-radio>
      </ion-item>
      <ion-item>
      <ion-label style="white-space:pre-wrap">In last 6 months</ion-label>
        <ion-radio (click)="login(180)" [checked]="this.checked_login == 180"></ion-radio>
      </ion-item>
      <ion-item>
      <ion-label style="white-space:pre-wrap">In last 9 months</ion-label>
        <ion-radio (click)="login(270)" [checked]="this.checked_login == 270"></ion-radio>
      </ion-item>
      </ion-list>
    </div>
 </ion-col>
</ion-row>
<ion-item id="footer">
  <button ion-button id="footerbtn" (click)="apply()">Apply</button>
</ion-item>
</ion-content>
`
})
export class SearchEmployeePage {
    searchCity: string = '';
    searchControl: FormControl;
    searchCityControl: FormControl;
    searchingCity: any = false;
    city:any
    cities:any
    c_id:any;
    city_name:any;
    http:any;
    checked_login:any;
    hash:any;
    days:any;
    searching:any = false;
    pname:any;
    post:any;
    experience:any;
    searchTerm: string = '';
    exp = [];
    filters: Array<{id: number, title: string,active: boolean}>;
    constructor(
    http: Http,
    public navParams : NavParams,
    private storage: Storage,
    public network: NetworkServiceProvider,
    public navCtrl: NavController,
    public dataService: Designation,
    public cityService: City,
    public viewCtrl: ViewController,
  ) {
      this.pname = navParams.get('pname')
      this.city_name = navParams.get('city_name')
      this.experience = navParams.get('experience')
      this.days = navParams.get('days')
     this.searchControl = new FormControl();
     this.searchCityControl = new FormControl();
     this.checked_login = navParams.get('days');
     this.filters = [
       { id:0, title:'Position', active:true},
       { id:1, title:'City', active:false},
       { id:2, title:'Experience', active:false},
       { id:3, title:'Login', active:false }
      ];
        this.http = http;
       for(var i = 1 ; i < 51 ; i++){
          this.exp.push(i)
        }
        
        this.setFilteredItems();
        this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
            this.searching = false;
            this.setFilteredItems();
                 });
        this.setFilteredCity();
        this.searchCityControl.valueChanges.debounceTime(700).subscribe(search => {
        this.searchingCity = false;
        this.setFilteredCity();
                 });
      }
  getStyle(p) {
     for(var i = 0; i < (this.filters.length) ; i++){
        if(this.filters[i].active == true) {
            if(p == i){
              return "#ddd7d7";
              }else {
                return "";
              }
          }
     }
  }
setActive(p){
  if(this.network.noConnection()){
        this.network.showNetworkAlert()
    }else{  
        for(var i = 0; i < (this.filters.length) ; i++){
          if(p == i){
            this.filters[i].active = true
          }
          else{
            this.filters[i].active = false
          }
        }
        setTimeout(() => {
        }, 1000)
    }
  }
    onclick(item){
      if(this.network.noConnection()){
           this.network.showNetworkAlert()
        }else{  
        this.pname = item.designation;
        }
      }
  onClickCity(item){
    if(this.network.noConnection()){
           this.network.showNetworkAlert()
        }else{  
        this.city_name = item.city_name;
        this.c_id = item.c_id
      }
    }
  onSearchCity(){
      this.searchingCity = true;
                    }
  onSearchInput(){
      this.searching = true;
                    }
  setFilteredItems() {
      this.post = this.dataService.filterItems(this.searchTerm);
             }
  setFilteredCity(){
            this.cities = this.cityService.filterItems(this.searchCity);
             }
  exp_checker(i){
        this.experience = i;
      }
  login(days){
        this.days = days;
      }
  apply(){
    if(this.network.noConnection()){
           this.network.showNetworkAlert()
        }else{  
          let data = {
            pname:this.pname,
            city_name: this.city_name,
            city_id:this.c_id,
            c_id:this.c_id,
            experience: this.experience,
            days: this.days,
          }
        this.viewCtrl.dismiss(data);
    }
}
  dismiss() {
    let data = {
        pname:null,
        city_id:null,
        city_name: null,
        c_id:null,
        experience: null,
        days: null,
  }
    this.viewCtrl.dismiss(data);
  }
}
