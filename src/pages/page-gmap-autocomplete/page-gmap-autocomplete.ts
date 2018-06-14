import { Component, OnInit } from '@angular/core';
import { Events, NavController, ModalController, ViewController, NavParams, AlertController,LoadingController } from 'ionic-angular';
//import { ModalAutocompleteItems } from '../modal-autocomplete-items/modal-autocomplete-items';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Validators, FormBuilder } from '@angular/forms'
import { Storage } from '@ionic/storage';
import { ListPage } from '../list/list';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { ModalRegisterMapPage } from "../modal-register-map/modal-register-map";
declare var google: any;
var self = this;
let loader
@Component({
    selector: 'page-page-gmap-autocomplete',
    templateUrl: 'page-gmap-autocomplete.html'
})
export class PageGmapAutocomplete implements OnInit {

    address:any = {
        place: '',
        set: false,
    };
    placesService:any;
    addr:any;
    map: any;
    markers = [];
    placedetails: any;
    arrayX:any
    http:any
    items:any
    pata:any
    mapAddr:any
    name:any
    designation:any
    mainname:any
    pname:any
    out:any
    outlet_name:any
    emp_id:any;
    myDate: String = new Date().toISOString()
    myModel:any
    hotel_id:any
    emp:any;
    arr:any=[]
    formMap:any;
    resitems:any;
    employeecontact:any
    constructor(public form: FormBuilder,
                public events: Events,
                public loadingCtrl: LoadingController,
                public storage: Storage,
                public network: NetworkServiceProvider,
                public alertCtrl: AlertController,
                public navCtrl: NavController,http: Http,
                public viewCtrl: ViewController,
                private modalCtrl: ModalController, private navParams: NavParams) { 
      this.name = navParams.get('name');   
      this.emp_id = navParams.get('emp_id')
      this.designation = navParams.get('designation')
      this.employeecontact=navParams.get('contact')
      this.http = http;
      this.formMap = this.form.group({
        "hotel_id":["", Validators.compose([Validators.required])],
        "thisaddplace":["", Validators.compose([Validators.required])],
        "date":["", Validators.compose([Validators.required])]
      })
      this.storage.get("id").then((id)=>{
      this.storage.get("Hash").then((value)=>{
      let headers = new Headers({
       'Content-Type': 'application/json',
       'Authorization': value
     });
     let options = new RequestOptions({ headers: headers });
      this.http.get("http://www.forehotels.com:3000/api/job_posted/"+id, options)
            .subscribe(data =>{
             this.items=JSON.parse(data._body).Jobs;
             this.outlet_name=this.items["0"].name 
             },error=>{
             } );
          })  
        })   
} 
 apply(){
     if(this.network.noConnection()){
           this.network.showNetworkAlert()
        }else{  
            let emp_device_id;
            this.storage.get("id").then((id)=>{
            this.storage.get("Hash").then((hash)=>{
                    var lat = this.placedetails.lat
                    var lng = this.placedetails.lng
                    var lat_lng  = this.placedetails.lat+","+this.placedetails.lng
            let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': hash
            });
            let body = JSON.stringify({
            hotel_id: id,
            emp_id: this.emp_id,
            location:lat_lng,
            interview_address: this.pata,
            interview_date_time:this.myDate,
            job_id:this.hotel_id,
            device_id:this.items["0"].device_id
            });
            let options = new RequestOptions({ headers: headers });
            this.http
                .post('http://forehotels.com:3000/api/schedule_interview', body, options)
                .subscribe(
                    data => {
                        let alerts = this.alertCtrl.create({
                        title: 'Success',
                        subTitle: this.name+' has been scheduled for an interview',
                        buttons: ['OK']
                        });
                        alerts.present();
                    });
                    let mssg=JSON.stringify({
                        number:this.employeecontact,
                        text:'You have been scheduled for Interview at '+this.items[0].name+'.\n Location: '+this.pata+'.\n Interview date and time: '+this.myDate

                    });
                    this.http.post('http://forehotels.com:3000/api/send_sms',mssg,options).subscribe(
                        data=>console.log('success'),
                        err=>console.log(err)
                    );
            
                this.http.get('http://forehotels.com:3000/api/employee/'+this.emp_id, options)
                    .subscribe(data =>{
                        this.resitems = JSON.parse(data._body).Users;
                        emp_device_id = this.resitems[0].device_id                    
                        
                        let Noti_headers = new Headers({
                            'Content-Type': 'application/json',
                            'Authorization': 'Basic NzE2MWM1N2MtY2U2OC00NDM5LWIwMzktNjM3ZjA2MTYyN2Y0',
                            'Cache-Control': 'no-cache'
                        })
                        let Noti_body = JSON.stringify({
                            device_id: emp_device_id,
                            message: 'You have been scheduled for Interview at '+this.items[0].name,
                            app_id: 'a8874a29-22e2-486f-b4b3-b3d09e8167a5'
                        })
                        let Noti_options = new RequestOptions({headers : Noti_headers})
                        this.http.post('http://forehotels.com:3000/api/single_notification', Noti_body, Noti_options)
                        .subscribe(data =>{
                    });
                });
            });
            
        });       
        

            this.navCtrl.setRoot(ListPage)
    }
}
  dismiss() {
    let data = {
  }
    this.viewCtrl.dismiss(data);
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
       let modal = this.modalCtrl.create(ModalRegisterMapPage);;
        modal.onDidDismiss(data => {
            loader = this.loadingCtrl.create({
                spinner: 'bubbles',
                content: 'Please Wait...'
            })
            loader.present()
            if(data){
                this.mapAddr = data.description.split(",")
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
                console.log(self.placedetails)
                self.showDetails(self.placedetails.address)                                 
                self.map.setCenter(place.geometry.location);
                self.createMapMarker(place);
                self.address.set = true;
                console.log('Address: '+ self.placedetails.address);
            }
            else{
            }       
        }
    }
    public showDetails(place){
        this.pata= this.mapAddr[0]+","+place
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