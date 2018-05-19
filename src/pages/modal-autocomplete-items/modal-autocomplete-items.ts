import { Component, OnInit } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
declare var google: any;
var self = this;

@Component({
    selector: 'page-modal-autocomplete-items',
    templateUrl: 'modal-autocomplete-items.html'
})
export class ModalAutocompleteItems implements OnInit{
    address:any = {
        place: '',
        set: false,
    };    
    addr:any;
    map: any;
    markers = [];
    placedetails: any;

    autocompleteItems: any;
    autocomplete: any;
    acService:any;
    placesService: any;

    constructor(public viewCtrl: ViewController,public network: NetworkServiceProvider) { 
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

