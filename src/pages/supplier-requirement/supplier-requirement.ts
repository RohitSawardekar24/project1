import { Component } from '@angular/core';
import { Platform, NavController, NavParams, AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ListPage } from '../list/list'
import { Validators, FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { UpgradePackageProvider } from '../../providers/upgrade-package/upgrade-package';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@Component({
  selector: 'page-supplier-requirement',
  templateUrl: 'supplier-requirement.html'
})
export class SupplierRequirementPage {
http:any;
  items:any;
  supplierReqForm:any;
  sup_items:any
  product_cat:any;
  i:any;
  sc_name:any
  constructor(public storage: Storage,
              private form: FormBuilder,http: Http,
              private alertCtrl: AlertController,
              public platform: Platform,
              public ga: GoogleAnalytics,
              public upgrade: UpgradePackageProvider,
              public network: NetworkServiceProvider,
              public navCtrl: NavController,
              public navParams: NavParams) {
              this.http = http;
              this.storage.get("id").then((id) => {
                this.platform.ready().then(() => {
                this.ga.trackEvent("Supplier Requirement", "Opened", "New Session Started", id, true)
                this.ga.setAllowIDFACollection(true)
                this.ga.setUserId(id)
                this.ga.trackView("Supplier Requirement")
            });
          })
              this.supplierReqForm = this.form.group({
              "contact_name":["", Validators.required],
              "contact_num":["", Validators.required],
              "produt_desc":["", Validators.required],
              "no_of_units":["",Validators.required],
              "budget":["",Validators.required],
              "h_address":["",Validators.required]
            })
  }
   
productCategory(){
  if(this.network.noConnection()){
     this.network.showNetworkAlert()
    }else{ 
        this.storage.get("Hash").then((hash)=>{
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': hash
          });
          let options = new RequestOptions({ headers: headers });
          this.http
          .get("http://localhost:3000/api/supplier_category", options)
                .subscribe(data =>{
                  this.items = JSON.parse(data._body)
                let alert = this.alertCtrl.create();
                for(var i=0 ; i<this.items.length; i++){
                    alert.addInput({
                          type: 'radio',
                          label: this.items[i].sc_name,
                          value: this.items[i].sc_id+","+this.items[i].sc_name,
                          checked: false,
                          });
                      }
                  alert.addButton('Cancel');
                  alert.addButton({
                    text: 'Okay',
                    handler: data => {
                    let datasplit= data.split(",")
                    this.sc_name = datasplit[1]
                    this.product_cat = datasplit[0];
                    }
                  });
                  alert.present()
                });
              });
    }  
  }
  supplierReq(){
    if(this.network.noConnection()){
       this.network.showNetworkAlert()
    }else{
      if(window.localStorage.getItem('status') == 'free'){
          this.upgrade.upgradepackage()
        }else{
        this.items = this.supplierReqForm.value;
        let number = this.items.contact_num;
        this.storage.get("id").then((id)=>{
          this.storage.get("hotelname").then((hotelname)=>{
            this.storage.get("Hash").then((hash)=>{
            let supplier_body = {
            }
            let headers = new Headers({
              'Content-Type': 'application/json',
              'Authorization': hash
            });
            let options = new RequestOptions({ headers: headers });
            this.http.post("http://localhost:3000/api/suppliers", supplier_body, options)
            .subscribe(data => {
              this.sup_items = JSON.parse(data._body).Users_Applied; //Bind data to items object
            for(let i=0; i<this.sup_items.length; i++){
              if(this.sup_items[i].s_cat_id == this.product_cat){
                let sms_body = JSON.stringify({
                    number: this.sup_items[i].hr_number,
                    text:  'Hello '+this.sup_items[i].name+' there is a '+this.sup_items[i].sc_name+' requirement '+' for '+hotelname +', Contact '+number+' for further details'
                });
                this.http
                      .post("http://localhost:3000/api/send_sms", sms_body, options)
                            .subscribe(data =>{
        
                    }) 
              }
            }
            });     
          let body = JSON.stringify({
          user_id:id, 
          contact_name: this.items.contact_name,
          contact_num: this.items.contact_num,
          produt_desc:this.items.produt_desc,
          no_of_units:this.items.no_of_units,
          budget:this.items.budget,
          h_address:this.items.h_address,
          category:this.product_cat
          });
          this.http
              .post('http://localhost:3000/api/post_supplier_requirement', body, options)
              .subscribe(
              data => {
                this.items=JSON.parse(data._body)
                if(this.items.Error == false){
                  let alert = this.alertCtrl.create({
                        title: 'Supplier Requirement Posted Successfully!',
                        buttons: ['OK']
                        });
                        alert.present();
                        this.navCtrl.setRoot(ListPage)
                  }
                else{
                    let alert = this.alertCtrl.create({
                        title: 'Something went wrong!',
                        subTitle: 'Please try after sometime',
                        buttons: ['Retry']
                        });
                        alert.present();
                }
              });
            });   
            });
          });
      }
    } 
  }
}