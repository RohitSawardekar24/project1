import { Component } from '@angular/core';
import { Platform, NavController, NavParams, AlertController, MenuController, ModalController, ViewController, LoadingController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Validators, FormBuilder } from '@angular/forms';
import { LoginPage } from '../login/login';
import { ModalRegisterMapPage } from '../modal-register-map/modal-register-map';
import { Storage } from '@ionic/storage';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
declare var google :any
var self = this;
let loader;

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  http:any;
  pata:any;
  mapAddr:any;  
  services: Array<{title:string, icon:any}>
  rows: any;
  constructor(public loadingCtrl: LoadingController,
              public viewCtrl: ViewController,
              public modalCtrl: ModalController,
              public menu: MenuController,
              public platform: Platform,
              public ga: GoogleAnalytics,
              public storage: Storage,
              public network: NetworkServiceProvider,
              private alertCtrl: AlertController,
              public navCtrl: NavController, 
              public navParams: NavParams,
              private form: FormBuilder,
              http: Http) {
              this.storage.get("id").then((id) => {
              this.platform.ready().then(() => {
                this.ga.trackEvent("Register", "Opened", "New Session Started", id, true)
                this.ga.setAllowIDFACollection(true)
                this.ga.setUserId(id)
                this.ga.trackView("Register")
            });
          })     

            this.menu.enable(false)
            this.http = http;
            this.services =[
                {title:'standalone', icon:'std.png'},
                {title:'state Chain', icon:'state.png'},
                {title:'national Chain', icon:'nat.png'},
                {title:'international Chain', icon:'inter.png'},]
                this.rows = Array.from(Array(Math.ceil(this.services.length/2)).keys());
    }

    selectvalue(data){
        if(this.network.noConnection()){
           this.network.showNetworkAlert()
        }else{ 
            this.navCtrl.push(ModalHotelCategoryPage,{
                hotelType: data.title        
            },{animate:true,animation:'transition',duration:500,direction:'forward'})
        }
    }  
}

/**************ModalHotelCategoryPage***************/
@Component({
  template: `
  <ion-header>
  <ion-navbar>
    <ion-title>
      Register
    </ion-title>
  </ion-navbar>
</ion-header>
 
<ion-content>
    <ion-list style="background-color:#ffffff;padding-top: 2%;text-align:center">
        <ion-list-header class="listheader" style="font-size:1.5em;text-align:center">
            Select Hotel Category
        </ion-list-header>
        <ion-grid>                      
            <ion-row *ngFor="let i of rows">
                <ion-col *ngFor="let p of resitems | slice:(i*3):(i+1)*3" (click)="selectvalue(p)">
                <img src="https://www.forehotels.com/public/assets/img/category/{{p.icon}}"/>
                    <p>{{p.cat_name}}</p>
                </ion-col>
            </ion-row>
        </ion-grid>
    </ion-list> 
</ion-content>
`
})
export class ModalHotelCategoryPage {

    http: any;
    rows: any;
    resitems: any;
    hotelType: any;

    mnumber: any 

    constructor(public navCtrl: NavController,
                public viewCtrl: ViewController, 
                public navParams: NavParams,
                public storage: Storage,
                public network: NetworkServiceProvider,
                http: Http,
                public loadingCtrl: LoadingController) {
                this.hotelType = navParams.get('hotelType');
                this.storage.get("Hash").then((hash)=>{
                let loader = this.loadingCtrl.create({
                spinner: 'bubbles',
                content: 'Fetching Category...'
                }); 
                loader.present()                
                this.http = http;
                let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': hash
                });
                let options = new RequestOptions({ headers: headers });
                this.http.get("http://www.forehotels.com:3000/api/hotel_category", options)
                        .subscribe(data =>{
                        this.resitems=JSON.parse(data._body).Category;
                        console.log(this.resitems);
                loader.dismiss()
                this.rows = Array.from(Array(Math.ceil(this.resitems.length/3)).keys());
            });
        });
    }
 selectvalue(data){
    if(this.network.noConnection()){
       this.network.showNetworkAlert()
    }else{ 
        this.navCtrl.push(ModalHotelDetails,{
            hotelCatid: data.id,
            hotelType: this.hotelType        
        },{animate:true,animation:'transition',duration:500,direction:'forward'})
        }
    }    
}
/*****************ModalHotelCategoryPage*****************/

/*****************ModalHotelDetails******************/
@Component({
    template: `
    <style>
    .text-input[disabled] {
      opacity: 1.4 !important;
      height: 100%;
  }
  #myInput{
          height: 70px;
  }
    </style>
    <ion-header>
    <ion-navbar>
      <ion-title>
        Register
      </ion-title>    
    </ion-navbar>
  </ion-header>
   
  <ion-content>
  <div id="map"></div>
  <form [formGroup]="mobileForm" (ngSubmit)="selectvalue(mobileForm.value)"> 
      <ion-list style="margin: -1px 0 0px;">
              <ion-item (click)="showModal()">
                      <ion-label color="primary" stacked>Outlet address</ion-label>
                      <ion-label *ngIf="address.place == ''">Enter Outlet address</ion-label>
                      <ion-textarea id="myInput" disabled="true" *ngIf="address.place != ''" [formControl]="mobileForm.controls['thisaddplace']" [(ngModel)]="this.pata"></ion-textarea>
              </ion-item>
  
              <ion-item>
              <ion-label color="primary" stacked>Outlet Name</ion-label>
                  <ion-input [formControl]="mobileForm.controls['addplace']" placeholder="Outlet Name" type="text" [(ngModel)]="this.outletName"></ion-input>
              </ion-item>            
              <ion-item>                
                      <ion-label color="primary">State -&nbsp;&nbsp;{{this.state}}</ion-label>
                      <ion-label color="primary">City -&nbsp;&nbsp;{{this.city}}</ion-label>
              </ion-item>                     
      </ion-list>
      
          <ion-list>        
              <ion-item>
                  <ion-label color="primary" stacked>Mobile Number</ion-label>
                  <ion-input placeholder="Mobile Number" [formControl]="mobileForm.controls['number']" type="number" required></ion-input>
              </ion-item>
              <div *ngFor="let validation of validation_Number" class="error-box">
                  <div style="text-align: center;color:#f53d3d" color="danger" *ngIf="mobileForm.controls['number'].hasError(validation.type) && mobileForm.controls['number'].touched">
                  {{validation.message}}
                  </div>
              </div>  
          </ion-list>        
          <ion-item id="footer">
              <button ion-button [disabled]="!mobileForm.valid" id="footerbtn">Generate OTP</button>
          </ion-item>
      </form>     
  </ion-content>
  `
  })
  export class ModalHotelDetails {
  
       address:any = {   
          place: '',
          set: false,
      };
      placesService:any;
      addr:any;
      map: any;
      markers = [];
      mainname:any;
      placedetails:any;
      mapAddr: any;
      outletName: any;
      pata: any;
      city: any;
      state: any;
  
      s_id: any;
      response: any;
      c_id: any
      response_city: any;
      items:any
      http: any;   
      hotelType: any;
      hotelCatid: any;
      Mnumber: any;
      otp:any;
      mobileForm:any;
      addplace:any;
      validation_Number:Array<{type:any,message:any}> 
  
      constructor(public navCtrl: NavController,
                  public viewCtrl: ViewController,
                  public storage: Storage,
                  public network: NetworkServiceProvider, 
                  public form: FormBuilder,
                  public navParams: NavParams,
                  public modalCtrl: ModalController,
                  http: Http,
                  public loadingCtrl: LoadingController) {
  
                  this.hotelType = navParams.get('hotelType'); 
                  this.hotelCatid= navParams.get('hotelCatid')
                  this.http =http 
                  this.otp = Math.floor(100000 + Math.random() * 900000)
            this.mobileForm = this.form.group({
                      "number":["", Validators.compose([Validators.maxLength(10),Validators.minLength(10),Validators.required])],
                      "addplace":["", Validators.compose([Validators.required])],
                      "thisaddplace":["", Validators.compose([Validators.required])]
                  })
            this.validation_Number = [
                        { type: 'required', message: 'Number is required.' },
                        { type: 'minlength', message: 'Number must be at least 10 Numbers long.' },
                        { type: 'maxlength', message: 'Number cannot be more than 10 Numbers long.' },
                        { type: 'pattern', message: 'Sorry you can not use characters' }]
      }  
  selectvalue(data){
      if(this.network.noConnection()){
         this.network.showNetworkAlert()
        }else{            
            this.items = this.mobileForm.value
            this.storage.get("Hash").then((hash)=>{
            let body = JSON.stringify({
                number: this.items.number,
                text: "Welcome, Your OTP is "+this.otp+". Please Verify to register on ForeHotels"
                })
                let headers = new Headers({
                  'Content-Type': 'application/json',
                  'Authorization': hash
                });
                let options = new RequestOptions({ headers: headers });
                this.http
                .post("http://forehotels.com:3000/api/send_sms", body, options)
                      .subscribe(data =>{
              })
            })
          this.navCtrl.push(OtpPage,{
          hotelType: this.hotelType,
          hotelCatid: this.hotelCatid,        
          pata: this.pata,           
          outletname: this.outletName,
          mnumber: this.items.number,
          otp: this.otp, 
          state: this.s_id,
          city: this.c_id,  
        },{animate:true,animation:'transition',duration:500,direction:'forward'})
        }
    }      
 ngOnInit() {  
          this.initMap();
          this.initPlacedetails();
      }
  
 showModal() {
     if(this.network.noConnection()){
           this.network.showNetworkAlert()
        }else{ 
         this.reset();
         let modal = this.modalCtrl.create(ModalRegisterMapPage);
          modal.onDidDismiss(data => {
              loader = this.loadingCtrl.create({
                  spinner: 'bubbles',
                  content: 'Please Wait...'
              })
              loader.present()
              if(data){
                  this.mapAddr = data.description.split(",")
                  this.outletName = this.mapAddr[0];
                  this.address.place = data.description;
                  this.getPlaceDetail(data.place_id);
              }
              else if(data == null){
                  loader.dismiss()
              }                
          })
          modal.present();
        }
    }
 private reset() {
          this.initPlacedetails();
          this.address.place = '';
          this.address.set = false;
      }
  
      private getPlaceDetail(place_id:string):void {
          var self = this;
          var request = {
              placeId: place_id
          };
          this.placesService = new google.maps.places.PlacesService(this.map);
          this.placesService.getDetails(request, callback);
          function callback(place, status) {
              console.log('page > getPlaceDetail > place > ', place);
              if (status == google.maps.places.PlacesServiceStatus.OK) {
                  self.placedetails.address = place.formatted_address;
                  self.placedetails.lat = place.geometry.location.lat();
                  self.placedetails.lng = place.geometry.location.lng();
                  
                  for (var i = 0; i < place.address_components.length; i++) {
                      let addressType = place.address_components[i].types[0];
                      let values = {
                          short_name: place.address_components[i]['short_name'],
                          long_name: place.address_components[i]['long_name']
                          
                      }
                      if(self.placedetails.components[addressType]) {
                          self.placedetails.components[addressType].set = true;
                          self.placedetails.components[addressType].short = place.address_components[i]['short_name'];
                          self.placedetails.components[addressType].long = place.address_components[i]['long_name'];
                      }                                     
                  } 
                  console.log(self.placedetails.components.administrative_area_level_1.long)
                  console.log(self.placedetails.components.administrative_area_level_2.long)
                  self.showDetails(self.placedetails.address,self.placedetails.components)                                 
                  self.map.setCenter(place.geometry.location);
                  self.createMapMarker(place);
                  self.address.set = true;
                  console.log('Address: '+ self.placedetails.address);
              }
              else{
              }       
          }
      }

    public showDetails(place,components){
        if(this.network.noConnection()){
           this.network.showNetworkAlert()
        }else{ 
            this.storage.get("Hash").then((hash)=>{        
          this.pata= this.mapAddr[0]+","+place
          loader.dismiss()
          var temp = components.locality.long.split(" ")
          this.city = temp[0]
          this.state = components.administrative_area_level_1.long
          let headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': hash
        });
        let options = new RequestOptions({ headers: headers });
        this.http
            .get("http://www.forehotels.com:3000/api/state", options)
              .subscribe(data =>{
                this.response = JSON.parse(data._body)
                for(let i=0; i<this.response.length; i++){
               if(this.state.toLowerCase() == this.response[i].state_name.toLowerCase()){
                 this.s_id = this.response[i].s_id
               }
             }
          });
         this.http
            .get("http://www.forehotels.com:3000/api/city", options)
              .subscribe(data =>{
                this.response_city = data.json()
                for(let i=0; i<this.response_city.length; i++){
               if(this.city.toLowerCase() == this.response_city[i].city_name.toLowerCase()){
                 this.c_id = this.response_city[i].c_id
               }
             }
          }); 
        })
      }
   }
    private initMap() {
          var point = {lat: -34.603684, lng: -58.381559}; 
          let divMap = (<HTMLInputElement>document.getElementById('map'));
          this.map = new google.maps.Map(divMap, {
              center: point,
              zoom: 15,
              disableDefaultUI: true,
              draggable: false,
              zoomControl: true
          });
      }
  
      private createMapMarker(place:any):void {
          var placeLoc = place.geometry.location;
          var marker = new google.maps.Marker({
            map: this.map,
            position: placeLoc
          });    
          console.log("MARKER: "+marker)
          this.markers.push(marker);
      }
  
      private initPlacedetails() {
          this.placedetails = {
              address: '',
              lat: '',
              lng: '',
              components: {
                  route: { set: false, short:'', long:'' },                           // calle 
                  street_number: { set: false, short:'', long:'' },                   // numero
                  sublocality_level_1: { set: false, short:'', long:'' },             // barrio
                  locality: { set: false, short:'', long:'' },                        // localidad, ciudad
                  administrative_area_level_2: { set: false, short:'', long:'' },     // zona/comuna/partido 
                  administrative_area_level_1: { set: false, short:'', long:'' },     // estado/provincia 
                  country: { set: false, short:'', long:'' },                         // pais
                  postal_code: { set: false, short:'', long:'' },                     // codigo postal
                  postal_code_suffix: { set: false, short:'', long:'' },              // codigo postal - sufijo
              }    
          };        
      }
      
  }
  /****************ModalHotelDetails**************/

/****************OTP-Page-Start**************/
@Component({
  template: `
  <ion-header>
    <ion-navbar>
        <ion-title>Otp</ion-title>
    </ion-navbar>
</ion-header>
<ion-content padding>
  <form [formGroup]="OTPForm" (ngSubmit)="success()">
        <ion-list>
            <ion-item>
            <ion-label color="primary" floating>Enter OTP Number Here</ion-label>
            <ion-input type="Number" formControlName="OtpNumber" required></ion-input>
            </ion-item>
        </ion-list>
         <button ion-button round full type="submit" [disabled]="!OTPForm.valid">
         Proceed             
        </button> 
  </form>
</ion-content>
`
})
  
  export class OtpPage {
  otp: any;
  OTPForm: any;
  otpNum: any;
  items: any;

  hotelType: any;
  hotelCatid: any;
  pata: any;
  outletname: any;
  mnumber: any;
  city: any;
  state: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public from: FormBuilder, 
              public network: NetworkServiceProvider,
              public alertCtrl:AlertController) {

              this.hotelType = navParams.get('hotelType')
              this.hotelCatid = navParams.get('hotelCatid');
              this.pata = navParams.get('pata');
              this.outletname = navParams.get('outletname');
              this.mnumber = navParams.get('mnumber');
              console.log(this.mnumber)
              this.otp = navParams.get('otp')
              console.log(this.otp)
              this.city = navParams.get('city')
              this.state = navParams.get('state')
              this.OTPForm = this.from.group({
                "OtpNumber":["",Validators.required],
              })
  }

  success(){
      if(this.network.noConnection()){
           this.network.showNetworkAlert()
        }else{ 
            this.items = this.OTPForm.value
            this.otpNum = this.items.OtpNumber
            if(this.otpNum == this.otp){
            this.navCtrl.push(ManagerDetailsPage,{        
                hotelType: this.hotelType,
                hotelCatid: this.hotelCatid,        
                pata: this.pata,           
                outletname: this.outletname,
                mnumber: this.mnumber,
                otp: this.otp, 
                state: this.state,
                city: this.city,
            });
            }else{      
                let alert = this.alertCtrl.create({
                title: 'Ooops.. :(',
                subTitle: 'Sorry! This is Not Valid OTP',
                //buttons: ['Dismiss']
                buttons: [{
                        text: 'Retry',
                        role: 'cancel',
                        handler: () => {
                        console.log('Cancel clicked');         
                        }
                    },{
                            text: 'Go To Login',
                            handler: () => {
                            this.navCtrl.push(LoginPage,{           
                            },{animate:true,animation:'transition',duration:500,direction:'forward'})
                            }}]
                    });
                alert.present();
            }
        }
  }
}
/******************OTP-Page-End******************/

/******************ManagerDetailsPage*******************/
@Component({
  template: `
  <ion-header>
  <ion-navbar>
    <ion-title>Register</ion-title>
  </ion-navbar>
</ion-header>
<ion-content>
  <form [formGroup]="registrationForm" (ngSubmit)="loginForm(registrationForm.value)">
     <ion-list>
       <ion-list-header style="font-size:1.5em;font-weight:bold">
         Owner/Manager Details
       </ion-list-header>
       <ion-item>
        <ion-label color="primary" stacked>User Name</ion-label>
        <ion-input type="text" formControlName="user_name" placeholder="Ex: Owner's name" required></ion-input>
    </ion-item> 
       <ion-item>
    <ion-label color="primary" stacked>Owner/Manager Name</ion-label>
    <ion-input type="text" [formControl]="registrationForm.controls['hr_name']" placeholder="Mr. ABC"></ion-input>
        </ion-item>
        <div *ngFor="let validation of validation_messages" class="error-box">
        <div style="text-align: center;color:#f53d3d" color="danger" *ngIf="registrationForm.controls['hr_name'].hasError(validation.type) && registrationForm.controls['hr_name'].touched">
          {{validation.message}}
        </div>
      </div>
         <ion-item>
    <ion-label color="primary" stacked>Owner/Manager Email</ion-label>
    <ion-input type="email" [formControl]="registrationForm.controls['email']" placeholder="example@gmail.com"></ion-input>
        </ion-item>
    <div *ngFor="let validation of validation_Email" class="error-box">
    <div style="text-align: center;color:#f53d3d" color="danger" *ngIf="registrationForm.controls['email'].hasError(validation.type) && registrationForm.controls['email'].touched">
          {{validation.message}}
    </div>
    </div>   
    <ion-item>
    <ion-label color="primary" stacked>Owner/Manager Number</ion-label>
    <ion-input type="number" [formControl]="registrationForm.controls['hr_number']"></ion-input>
        </ion-item> 
     <div *ngFor="let validation of validation_Number" class="error-box">
       <div style="text-align: center;color:#f53d3d" color="danger" *ngIf="registrationForm.controls['hr_number'].hasError(validation.type) && registrationForm.controls['hr_number'].touched">
          {{validation.message}}
        </div>
      </div>   
        
        <ion-item>
    <ion-label color="primary" stacked>Set Password</ion-label>
    <ion-input type="password" [formControl]="registrationForm.controls['password']" placeholder="******"></ion-input>
        </ion-item>         
        <div *ngFor="let validation of validation_Password" class="error-box">
        <div style="text-align: center;color:#f53d3d" color="danger" *ngIf="registrationForm.controls['password'].hasError(validation.type) && registrationForm.controls['password'].touched">
          {{validation.message}}
        </div>
      </div>  
        <ion-item>
            <ion-label color="primary" stacked>Reference(optional)</ion-label>
            <ion-input type="text" formControlName="reference" placeholder="Mr. XYZ"></ion-input>
        </ion-item>
      </ion-list>
      <br>
          <ion-list style="text-align: center;">
          <button ion-button large type="submit" [disabled]="!registrationForm.valid">Register</button>
      </ion-list>
  </form>
</ion-content>
`
})

  export class ManagerDetailsPage {
    hotelType: any;
    hotelCatid: any;
    pata: any;
    outletname: any;
    mnumber: any;
    otp: any;
    city: any;
    state: any;

  http:any
  registrationForm:any;
  items:any
  name:any;
  email:any;
  gender:any
  validation_messages:Array<{type:any,message:any}>
  validation_Email:Array<{type:any,message:any}>
  validation_Number:Array<{type:any,message:any}>
  validation_Password:Array<{type:any,message:any}>
  constructor(public loadingCtrl: LoadingController,
              public viewCtrl: ViewController,
              public modalCtrl: ModalController,
              public menu: MenuController,
              private alertCtrl: AlertController,
              public storage : Storage,
              public network: NetworkServiceProvider,
              public navCtrl: NavController, 
              public navParams: NavParams,private form: FormBuilder,http: Http) {
              this.http = http

              this.hotelType = navParams.get('hotelType')
              this.hotelCatid = navParams.get('hotelCatid');
              this.pata = navParams.get('pata');
              this.outletname = navParams.get('outletname');
              this.mnumber = navParams.get('mnumber');
              this.otp = navParams.get('otp')
              this.city = navParams.get('city')
              this.state = navParams.get('state') 

              this.registrationForm = this.form.group({
                "hr_name":["", Validators.compose([Validators.maxLength(30),Validators.minLength(5),Validators.pattern('[a-zA-Z ]*'),Validators.required])],
                "email":["", Validators.compose([Validators.maxLength(30),Validators.minLength(10),Validators.pattern
                    ('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+\.[a-z]{2,3}$'),Validators.required])],
                "hr_number":[this.mnumber, Validators.compose([Validators.maxLength(10),Validators.minLength(10),Validators.required])],
                "user_name":["",Validators],
                "reference":["",Validators],                
                "password":["",Validators.compose([Validators.maxLength(10),Validators.minLength(4),Validators.required])]      
              }) 
              this.validation_messages = [
                { type: 'required', message: 'Username is required.' },
                { type: 'minlength', message: 'Username must be at least 5 characters long.' },
                { type: 'maxlength', message: 'Username cannot be more than 30 characters long.' },
                { type: 'pattern', message: 'Your username must contain only letters.' }]    
            this.validation_Email = [
                { type: 'required', message: 'Email is required.' },
                { type: 'minlength', message: '' },
                { type: 'maxlength', message: 'Email cannot be more than 30 characters long.' },
                { type: 'pattern', message: 'Please Enter Valid Email' }]    
            this.validation_Number = [
                { type: 'required', message: 'Number is required.' },
                { type: 'minlength', message: 'Number must be at least 10 Numbers long.' },
                { type: 'maxlength', message: 'Number cannot be more than 10 Numbers long.' },
                { type: 'pattern', message: 'Sorry you can not use characters' }]
            this.validation_Password = [
                { type: 'required', message: 'Password is required.' },
                { type: 'minlength', message: 'Password must be at least 4 characters long.' },
                { type: 'maxlength', message: 'Password cannot be more than 10 Characters long.' },
                { type: 'pattern', message: '' }]          
  }

loginForm(){
    if(this.network.noConnection()){
       this.network.showNetworkAlert()
      }else{
            this.items = this.registrationForm.value;
            let body = JSON.stringify({
                name: this.outletname,
                user_name: this.items.user_name,
                password: this.items.password,
                address: this.pata,
                user_type: 1,
                state: this.state,
                city: this.city,
                reference_name: this.items.reference,
                hr_name: this.items.hr_name,
                hr_number: this.items.hr_number,
                email: this.items.email,
                cat_id: this.hotelCatid,
                hotel_type: this.hotelType,
            });
            this.storage.get("Hash").then((hash)=>{
            let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': hash
            });
            let options = new RequestOptions({ headers: headers });
            this.http
                .post('http://www.forehotels.com:3000/api/users_hotel', body, options)
                .subscribe(
                    datas => {
                this.items = JSON.parse(datas._body)
                if(this.items.Error == false){
                    let alert = this.alertCtrl.create({
                        title: 'Congrats!',
                        subTitle: 'Your Account Has been Created Successfully.',
                        buttons: ['OK']
                        });
                        alert.present();
                        this.Sendsms();     
                        this.navCtrl.pop();
                        this.navCtrl.push(LoginPage)
                }
                else{
                    let alert = this.alertCtrl.create({
                        title: 'Error!',
                        subTitle: 'Please try again after sometime',
                        buttons: ['Retry']
                        });
                        alert.present();
                }
            });
            })
      }   
    }

       Sendsms(){
           this.storage.get('Hash').then((hash)=>{           
           let body = JSON.stringify({
              number: this.mnumber,
              text: "Hello "+this.outletname+", Welcome To Forehotels. Use Forehotels app regularly to hire Employees"
              })
              let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': hash
              });
              let options = new RequestOptions({ headers: headers });
              this.http
              .post("http://www.forehotels.com:3000/api/send_sms", body, options)
                    .subscribe(data =>{
            })
        })
    }
}
/************ManagerDetailsPageEnd************/
     
