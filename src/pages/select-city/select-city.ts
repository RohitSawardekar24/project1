import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { City } from '../../providers/city/city';
import { HelloIonicPage } from '../hello-ionic/hello-ionic'
import 'rxjs/add/operator/debounceTime';
import { FormControl } from '@angular/forms';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';

@Component({
  selector: 'page-select-city',
  templateUrl: 'select-city.html',
})
export class SelectCityPage {
  searchTerm: string = '';
    searchControl: FormControl;
    items: any;
    searching: any = false;
    designation:any
    loader:any
    constructor(public network: NetworkServiceProvider,public navCtrl: NavController, public navParams: NavParams, public dataService: City) {
      this.designation = navParams.get('designation')
      this.loader = navParams.get('loader')
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
          this.navCtrl.push(HelloIonicPage,{
            designation: this.designation,
            city_id: item
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
        this.loader.dismiss()
    }
}
