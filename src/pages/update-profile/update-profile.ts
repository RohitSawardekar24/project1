import { Component,OnInit } from '@angular/core';
import { Platform, NavController, NavParams, AlertController, ViewController, ModalController,LoadingController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { FormBuilder, Validators } from '@angular/forms'
import { Storage } from '@ionic/storage';
import { ProfilePicPage } from '../profile-pic/profile-pic';
import { ModalAutocompleteItems } from '../modal-autocomplete-items/modal-autocomplete-items';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
declare var google:any;
var self = this;
let loader

@Component({
  selector: 'page-update-profile',
  templateUrl: 'update-profile.html'
})
export class UpdateProfilePage implements OnInit{
  address:any = {
    place: '',
    set: false,
};
placesService:any;
addr:any;
map: any;
markers = [];
placedetails: any;
  items:any=['abd','78u'];
  http:any;
  hash:any;
  hotel_id:any;
  pata:any
  social_pic:boolean;
  cityname:any
  hotelname:any
  profilepic:any
  picpath='https://www.forehotels.com/public/assets/img/download1.jpg'
  constructor(public loadingCtrl: LoadingController,
              public modalCtrl: ModalController,
              http: Http, 
              public navCtrl: NavController,
              public network: NetworkServiceProvider,
              public navParams: NavParams,
              public ga: GoogleAnalytics,
              public platform: Platform,
              private storage: Storage,
              private alertCtrl: AlertController,) {
              this.http = http;
              this.social_pic = false;
              this.loaddata()   
  }
      loaddata(){
        if(this.network.noConnection()){
        this.network.showNetworkAlert()
        }else{
            this.storage.get("id").then((id) => {
                this.platform.ready().then(() => {
                this.ga.trackEvent("Update Profile", "Opened", "New Session Started", id, true)
                this.ga.setAllowIDFACollection(true)
                this.ga.setUserId(id)
                this.ga.trackView("Update Profile")
            });
          })
          this.storage.get("id").then((id)=>{ 
                this.storage.get("Hash").then((value) => {
                let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': value
              });
              let options = new RequestOptions({ headers: headers });

                this.http
                .get("http://localhost:3000/api/package/"+id, options)
                  .subscribe(data =>{
                    this.items=JSON.parse(data._body).Jobs; //Bind data to items object
                    if(this.items[0].profile_pic!= ''){
                      var Str = 'https://www.forehotels.com/public/hotel/avatar/'
                      this.profilepic = Str+this.items[0].profile_pic
                    }else{
                      this.profilepic = this.picpath;
                    }
                    
                    },error=>{
                    } );
                });  
              }) 
        }      
      }

  ngOnInit() {
      this.initMap();
      this.initPlacedetails()
  }
  
  updateProfilePic(){
    if(this.network.noConnection()){
       this.network.showNetworkAlert()
     }else{
          this.navCtrl.push(ProfilePicPage)
        }
    }

  hotel_name(){
    if(this.network.noConnection()){
       this.network.showNetworkAlert()
      }else{
        let prompt = this.alertCtrl.create({
        title: 'Hotel Name',
        inputs: [
          {
            value: this.items["0"].name
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {
            }
          },
          {
            text: 'Save',
            handler: name => {
            this.items["0"].name = name["0"];
              this.callAPI("name", name["0"])
            }
          }
        ]
      });
      prompt.present();
    }
  }

  email(){
    if(this.network.noConnection()){
       this.network.showNetworkAlert()
      }else{
          let prompt = this.alertCtrl.create({
          title: 'Email ID',
          inputs: [
            {
              value: this.items["0"].email
            },
          ],
          buttons: [
            {
              text: 'Cancel',
              handler: data => {;
              }
            },
            {
              text: 'Save',
              handler: email => {
                this.items["0"].email = email["0"];
                this.callAPI("email", email["0"])
              }
            }
          ]
        });
        prompt.present();
      }
    }   

  Updateaddress(){
    if(this.network.noConnection()){
       this.network.showNetworkAlert()
      }else{
        let modal = this.modalCtrl.create(ModalAutocompleteItems);      
        modal.onDidDismiss(data => {
        loader = this.loadingCtrl.create({
              spinner: 'bubbles',
              content: 'Please Wait...'
          })
          loader.present()
          if(data){
              //this.mapAddr = data.description.split(",")
              //this.address.place = data.description;
            this.getPlaceDetail(data.place_id);
          }            
          else if(data == null){
              loader.dismiss()
          }     
      })
      modal.present()
    }
 }  
    private getPlaceDetail(place_id:string):void {
          var self = this;
          var request = {
              placeId: place_id
          };
          this.placesService = new google.maps.places.PlacesService(this.map);
          this.placesService.getDetails(request, callback);
          function callback(place, status) {
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
                  // console.log(self.placedetails)
                  self.showDetails(self.placedetails.address)                                 
                  self.map.setCenter(place.geometry.location);
                  //self.address.set = true;
                  // console.log('Address: '+ self.placedetails.address);
              }
              else{
              }       
          }
      }
      public showDetails(place){
          this.items["0"].address = place;
          this.callAPI("address", place)
          loader.dismiss()
          console.log(place)
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
  
  hr_name(){
    if(this.network.noConnection()){
       this.network.showNetworkAlert()
      }else{
          let prompt = this.alertCtrl.create({
          title: 'HR/Manager Name',
          inputs: [
            {
              value: this.items["0"].hr_name
            },
          ],
          buttons: [
            {
              text: 'Cancel',
              handler: data => {
              }
            },
            {
              text: 'Save',
              handler: hr_name => {
                this.items["0"].hr_name = hr_name["0"];
                this.callAPI("hr_name", hr_name["0"])
              }
            }
          ]
        });
        prompt.present();
      }
    }     
  hr_number(){
    if(this.network.noConnection()){
       this.network.showNetworkAlert()
      }else{
        let prompt = this.alertCtrl.create({
        title: 'HR/Manager Number',
        inputs: [{
            value: this.items["0"].hr_number
          },
        ],
        buttons: [{
            text: 'Cancel',
            handler: data => {
            }
          },
          {
            text: 'Save',
            handler: hr_number => {
              this.items["0"].hr_number = hr_number["0"];
              this.callAPI("hr_number", hr_number["0"])
            }
          }]
      });
      prompt.present();
    }
  } 
   hotel_desc(){
     if(this.network.noConnection()){
        this.network.showNetworkAlert()
        }else{
          let prompt = this.alertCtrl.create({
          title: 'Hotel Description',
          inputs: [
            {
              value: this.items["0"].hotel_desc
            },
          ],
          buttons: [
            {
              text: 'Cancel',
              handler: data => {
              }
            },
            {
              text: 'Save',
              handler: hotel_desc => {
                this.items["0"].hotel_desc = hotel_desc["0"];
                this.callAPI("hotel_desc", hotel_desc["0"])
              }
            }
          ]
        });
        prompt.present();
      }
  }  
  callAPI(key,value){
        if(this.network.noConnection()){
        this.network.showNetworkAlert()
        }else{
          this.storage.get("id").then((id)=>{ 
          this.storage.get("Hash").then((hash)=>{  
        let body = JSON.stringify({
              key: key,
              value: value,
              id: id
              });
        let headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': hash
        });
        let options = new RequestOptions({ headers: headers });
        this.http
            .put('http://localhost:3000/api/hotel', body, options)
            .map(res => res.json())
            .subscribe(
                data => {
                  console.log(data);
                },
                err => {
                  console.log("ERROR!: ", err);
                }
            );
          }); 
        });
      }
   }     
    
    updatePassword() {
      if(this.network.noConnection()){
        this.network.showNetworkAlert()
        }else{
          let modal = this.modalCtrl.create(UpdatePasswordPage);
            modal.present();
        }
    }
}
@Component({
  template: `
  <ion-header>
  <ion-toolbar>
    <ion-title>
     Update Password
    </ion-title>
    <ion-buttons start>
      <button ion-button (click)="dismiss()">
        <ion-icon name="md-close" showWhen="android,windows,ios"></ion-icon>
      </button>
    </ion-buttons>
  </ion-toolbar>
</ion-header>
<ion-content>
<form [formGroup]="registrationForm" (ngSubmit)="loginForm()">
<ion-list>
<ion-item>
    <ion-label floating>Old Password</ion-label>
    <ion-input formControlName="old_password" type="password"></ion-input>
  </ion-item>
<ion-item>
    <ion-label floating>Password</ion-label>
    <ion-input formControlName="password" type="password"></ion-input>
  </ion-item>

  <ion-item>
    <ion-label floating>Confirm Password</ion-label>
    <ion-input formControlName="password" type="password"></ion-input>
  </ion-item>
  </ion-list>
  <div padding>
  <button [disabled]="!registrationForm.valid" ion-button full>Update Password</button>
</div>
</form>
</ion-content>`
})
export class UpdatePasswordPage{
registrationForm:any;
items:any;
login:any;
http:any;
disable:any;
hash:any;
constructor(private alertCtrl: AlertController,
            public storage:Storage,
            public navCtrl: NavController,
            public network: NetworkServiceProvider,
            private form: FormBuilder,http: Http,
            public viewCtrl: ViewController){
            this.registrationForm = this.form.group({
            "old_password":["",Validators.required],
            "password":["",Validators.required]
             })          
            this.http = http;
        }

  loginForm(){
      if(this.network.noConnection()){
        this.network.showNetworkAlert()
        }else{
        /*For updatepassword*/
          this.items = this.registrationForm.value;    //YOGESH!!!!!!!!!! THIS TAKES VALUE FROM FORM
          this.storage.get('Hash').then((hash) => {
            this.storage.get('id').then((id) =>{
          let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': hash
          });
          let options = new RequestOptions({ headers: headers });
          let body = JSON.stringify({
          id: id,
          old_password: this.items.old_password,
          new_password: this.items.password,
          });
          this.http
              .put('http://localhost:3000/api/password', body, options)
              .subscribe(
                  data => {
                    let res = data.json();
                    if(res.Response==false){
                      let alert = this.alertCtrl.create({
                      title: 'Password Doesnt Match!',
                      subTitle: 'Your old password is incorrect.',
                      buttons: ['RETRY']
                      });
                      alert.present();
                    }
                      else{
                      let alert = this.alertCtrl.create({
                      title: 'Password Updated!',
                      subTitle: 'Your password has been updated successfully.',
                      buttons: ['OK']
                      });
                      alert.present();
                      this.viewCtrl.dismiss();
                      }
                    });
              });
          });
        }
    }

    dismiss() {
    this.viewCtrl.dismiss();
  }
}