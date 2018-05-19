import { Component } from '@angular/core';
import { Platform, NavController, NavParams, ModalController, ViewController, LoadingController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { SupplierDetailPage } from '../supplier-detail/supplier-detail';
import { FormControl } from '@angular/forms';
import { Category } from '../../providers/category/category';
import { City } from '../../providers/city/city';
import { Storage } from '@ionic/storage';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@Component({
  selector: 'page-search-supplier',
  templateUrl: 'search-supplier.html'
})
export class SearchSupplierPage {
  items: any;
  http: any;
  modal: any;
  data: any;
  count:any;
  constructor(public storage: Storage,http: Http, 
              public navCtrl: NavController,
              public navParams: NavParams,
              public ga: GoogleAnalytics,
              public platform: Platform,
              public network: NetworkServiceProvider,
              public loadingCtrl: LoadingController,
              public modalCtrl: ModalController) {
           if(this.network.noConnection()){
              this.network.showNetworkAlert()
            }else{ 
              this.storage.get("id").then((id) => {
              this.platform.ready().then(() => {
                this.ga.trackEvent("Search Supplier", "Opened", "New Session Started", id, true)
                this.ga.setAllowIDFACollection(true)
                this.ga.setUserId(id)
                this.ga.trackView("Search Supplier")
            });
          })
              let loading = this.loadingCtrl.create({
                spinner: 'bubbles',
                content: 'Fetching Suppliers Details...'
              });
              loading.present();
              this.http = http;
              this.storage.get("Hash").then((val)=>{
              let body = {
              }
              let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': val
              });
              let options = new RequestOptions({ headers: headers });
              this.http.post("http://www.forehotels.com:3000/api/suppliers", body, options)
                .subscribe(data => {
                  this.items = JSON.parse(data._body).Users_Applied; //Bind data to items object
                  loading.dismiss()
            }, error => {
                  console.log(error);// Error getting the data
                });
              });
        } 
  }
  supplierDetail(id) {
    if(this.network.noConnection()){
           this.network.showNetworkAlert()
        }else{ 
        this.navCtrl.push(SupplierDetailPage, {
          id: id
        })
      }
  }
  filterSearch() {
    if(this.network.noConnection()){
       this.network.showNetworkAlert()
      }else{ 
            if (this.data != null) {
              this.modal = this.modalCtrl.create(FilterCategoryPage, {
                sc_name: this.data.sc_name,
                c_id: this.data.c_id,
                city_name: this.data.city_name
              });
            }
            else {
              this.modal = this.modalCtrl.create(FilterCategoryPage)
            }
            this.modal.onDidDismiss(data => {
              let loader = this.loadingCtrl.create({
                spinner: "bubbles",
                content: "Please wait...",
              });
              this.data = data
              loader.present();
              this.storage.get("Hash").then((value)=>{
              let body = {
                sc_name: data.sc_name,
                c_id:data.c_id,
                city_name: data.city_name
              };
              let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': value
              });
              let options = new RequestOptions({ headers: headers });
              this.http
                .post('http://forehotels.com:3000/api/suppliers', body, options)
                .subscribe(
                data => {
                  this.items = JSON.parse(data._body).Users_Applied;
                  this.count = this.items.length
                  loader.dismiss()
                });
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
      <ion-input [(ngModel)]="searchTerm" [formControl]="searchControl" value="{{this.sc_name}}" placeholder="Search" (ionInput)="onSearchInput()"></ion-input>
     </ion-card>

            <ion-item >
                <div *ngIf="searching" class="spinner-container">
                  <ion-spinner></ion-spinner>
                </div>
              <ion-scroll scrollY="true">
              <ion-list>
                  <ion-item *ngFor="let item of this.post" (click)="onclick(item)">
                      {{item.sc_name}}
                  </ion-item>
              </ion-list>
              </ion-scroll>
          </ion-item>
    </div>

    <!--For City-->
    <div *ngIf="this.filters[1].active == true">
    <ion-card style="display: flex;">
    <ion-icon style="font-size: 2.2em;padding: 5%;" name="search"></ion-icon>
    <ion-input [(ngModel)]="searchCity" [formControl]="CityControl" value="{{this.city_name}}" placeholder="Search" (ionInput)="onSearchCity()"></ion-input>    
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
 </ion-col>
</ion-row>
<ion-item id="footer">
  <button ion-button id="footerbtn" (click)="apply()">Apply</button>
</ion-item>

</ion-content>
`
})
export class FilterCategoryPage {
  searchControl: any;
  CityControl: any
  http: any;
  hash: any;
  searching: any;
  searchingCity: any;
  sc_name: any;
  city_name: any
  cities:any
  c_id:any;
  post: any;
  experience: any;
  searchTerm: string = '';
  searchCity: string = '';
  exp = [];
  filters: Array<{ id: number, title: string, active: boolean }>;
  constructor(
    http: Http,
    private storage: Storage,
    public navCtrl: NavController,
    public dataService: Category,
    public network: NetworkServiceProvider,
    public cityService: City,
    public viewCtrl: ViewController,
    public navParams: NavParams
  ) {
    this.sc_name = navParams.get('sc_name')
    this.city_name = navParams.get('city_name')
    this.searchControl = new FormControl();
    this.CityControl = new FormControl();
    this.filters = [
      { id: 0, title: 'Product', active: true },
      { id: 1, title: 'City', active: false }
    ];
    this.http = http;
    for (var i = 1; i < 51; i++) {
      this.exp.push(i)
    }
    this.setFilteredItems();
    this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searching = false;
      this.setFilteredItems();
    });
    this.CityControl.valueChanges.debounceTime(700).subscribe(search => {
      this.searchingCity = false;
      this.setFilteredCity();
    });
  }
  getStyle(p) {
    for (var i = 0; i < (this.filters.length); i++) {
      if (this.filters[i].active == true) {
        if (p == i) {
          return "#ddd7d7";
        } else {
          return "";
        }
      }
    }
  }
  setActive(p) {
    if(this.network.noConnection()){
       this.network.showNetworkAlert()
    }else{ 
      for (var i = 0; i < (this.filters.length); i++) {
        if (p == i) {
          this.filters[i].active = true
        }
        else {
          this.filters[i].active = false
        }
      }
      setTimeout(() => {
      }, 1000)
    }
  }
  onclick(item) {
    if(this.network.noConnection()){
       this.network.showNetworkAlert()
     }else{ 
          this.sc_name = item.sc_name;
     }
  }
  onClickCity(item) {
    if(this.network.noConnection()){
       this.network.showNetworkAlert()
      }else{ 
        this.city_name = item.city_name
        this.c_id = item.c_id
      }
  }
  onSearchInput() {
    this.searching = true;
  }
  onSearchCity() {
    this.searchingCity = true;
  }
  setFilteredItems() {
    this.post = this.dataService.filterItems(this.searchTerm);
    
  }
  setFilteredCity() {
    this.cities = this.cityService.filterItems(this.searchCity);
    
  }
  exp_checker(i) {
    this.experience = i;
  }
  apply() {
    if(this.network.noConnection()){
       this.network.showNetworkAlert()
    }else{ 
        let data = {
          sc_name: this.sc_name,
          c_id: this.c_id,
          city_name: this.city_name
        }
        this.viewCtrl.dismiss(data);
    }
  }
  dismiss() {
    if(this.network.noConnection()){
       this.network.showNetworkAlert()
      }else{ 
          let data = {
            sc_name: this.sc_name,
            c_id: this.c_id,
            city_name: this.city_name
          }
          this.viewCtrl.dismiss(data);
      }
    }
}
