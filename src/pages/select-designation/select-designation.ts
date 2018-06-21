import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Designation } from '../../providers/designation/designation';
import { SelectCityPage } from '../select-city/select-city';
import 'rxjs/add/operator/debounceTime';
import { FormControl } from '@angular/forms';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';

@Component({
  selector: 'page-select-designation',
  templateUrl: 'select-designation.html',
})
export class SelectDesignationPage {
searchTerm: string = '';
    searchControl: FormControl;
    items: any;
    searching: any = false;
    designation:any;
    index:number=0;
    length: number=0;
    constructor(public navCtrl: NavController,
                public network: NetworkServiceProvider,
                public dataService: Designation,
                public loadingCtrl: LoadingController) {
        this.searchControl = new FormControl();
    }
 
    ionViewDidLoad() { 
        if(this.network.noConnection()){
           this.network.showNetworkAlert()
        }else{ 
            this.setFilteredItems(); 
            this.searchControl.valueChanges.debounceTime(700).subscribe(search => { 
                this.searching = false;
                this.setFilteredItems(); 
            });
        }
    }
    onClick(item){
        if(this.network.noConnection()){
           this.network.showNetworkAlert()
        }else{ 
            let loader = this.loadingCtrl.create({
                spinner: 'bubbles',
                content: 'Fetching Cities...'
            })
            loader.present()
            this.navCtrl.push(SelectCityPage, {
                designation: item,
                loader: loader,
            })
        }
    }
    onSearchInput(){
        if(this.network.noConnection()){
           this.network.showNetworkAlert()
        }else{ 
            this.searching = true;
        }
    } 
    setFilteredItems() { 
        this.items = this.dataService.filterItems(this.searchTerm);
        this.length = this.items.length; 
    }
}