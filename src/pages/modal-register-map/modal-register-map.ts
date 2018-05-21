import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
declare var google: any;
 var self=this;

@Component({
  selector: 'page-modal-register-map',
  templateUrl: 'modal-register-map.html',
})
export class ModalRegisterMapPage implements OnInit{
  autocompleteItems: any[]=[];
    autocomplete: any;
    acService:any;


address:any = {
        place: '',
        set: false,
    };
    placesService:any;
    addr:any;
    map: any;
    markers = [];
    mainname:any
    placedetails:any

  constructor(public network: NetworkServiceProvider,public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit() {
        this.acService = new google.maps.places.AutocompleteService();        
        this.autocompleteItems = [];
        this.autocomplete = {
            query: ''
        };        
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    chooseItem(item: any) {
        this.viewCtrl.dismiss(item);
    }

    updateSearch() {
        if(this.network.noConnection()){
           this.network.showNetworkAlert()
        }else{  
            if (this.autocomplete.query == '') {
                this.autocompleteItems = [];
                return;
            }
            let self = this;
            let config = { 
                input: this.autocomplete.query, 
                componentRestrictions: { country: 'IN' } 
            }
            this.acService.getPlacePredictions(config, function (predictions, status) {
                self.autocompleteItems = [];            
                predictions.forEach(function (prediction) {              
                    self.autocompleteItems.push(prediction);
                });
            });
        }
    }
}

