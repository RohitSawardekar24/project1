import { Component } from '@angular/core';
import { Events, NavParams ,NavController,MenuController, ModalController, ViewController, LoadingController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { EmployeeDetailPage } from '../employee-detail/employee-detail';
import { FormControl } from '@angular/forms';
import { EmployeeTabPage } from '../employee-tab/employee-tab';
import { CateringTabPage } from '../catering-tab/catering-tab';
import { InternTabPage } from '../intern-tab/intern-tab';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
tab1: any;
tab2: any;
tab3: any;
c_id:any
http:any
resitems:any
c_items:any
i_items:any
designation:any
emp_length:any
catering_length:any
intern_length:any
  constructor(public events: Events, 
              public storage: Storage,
              public navParams: NavParams,
              http: Http,
              public network: NetworkServiceProvider,
              public loadingCtrl: LoadingController,
              public modalCtrl:ModalController ,
              public navCtrl: NavController, 
              public menu: MenuController) {
      if(this.network.noConnection()){
           this.network.showNetworkAlert()
        }else{
            this.storage.get("Hash").then((hash)=>{
            let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': hash
              });
              let options = new RequestOptions({ headers: headers });
            let body={
              pname: this.designation.designation,
              c_id: this.designation.c_id 
            }
            this.http = http
            this.events.subscribe('emp_length', (user) => {
              this.emp_length = user
            });
            this.http.get("http://localhost:3000/api/catering_users_list", options)
                    .subscribe(data =>{
                    this.c_items=JSON.parse(data._body).Jobs; 
                    this.catering_length = this.c_items.length
                });   
              this.http.get("http://localhost:3000/api/intern_users_list", options)
                    .subscribe(data =>{
                    this.i_items=JSON.parse(data._body).Jobs; //Bind data to items object
                    this.intern_length = this.i_items.length        
              });           
                  })  
                      
            this.designation = {
                designation: navParams.get('designation'),
                c_id: navParams.get('city_id')
              }
            this.tab1 = EmployeeTabPage;
            this.tab2 = CateringTabPage;
            this.tab3 = InternTabPage;
          }
      }
}