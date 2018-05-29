import { Component, NgZone, ViewChild, ElementRef} from '@angular/core';
import { Config, Platform, Events, NavController, NavParams, AlertController, ModalController, ViewController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { PageGmapAutocomplete } from '../page-gmap-autocomplete/page-gmap-autocomplete';
import { EmployeeDetailPage } from '../employee-detail/employee-detail'
import { DatePipe } from '@angular/common';
import { Storage } from '@ionic/storage'
import { Geolocation } from '@ionic-native/geolocation';
import { Toast } from '@ionic-native/toast';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
declare var google:any;

@Component({
  selector: 'page-schedule-interview',
  templateUrl: 'schedule-interview.html'
})
export class ScheduleInterviewPage {
items:any;
http:any;
data:any;
name:any;
hash:any
id:any
check_id=[]
check=[]
si_len
view:boolean=false
  constructor(public events: Events,
              public storage: Storage,
              public toast: Toast,
              public platform: Platform,
              public ga: GoogleAnalytics,
              public config: Config,
              public network: NetworkServiceProvider,
              private alertCtrl: AlertController,
              public navCtrl: NavController,
              public navParams: NavParams,http: Http,
              private modalCtrl: ModalController) {
              this.http = http;
              this.storage.get("id").then((id)=>{
                this.id = id
              })
            this.loadData()
  }
    loadData(){
      this.config.set('tabsHideOnSubPages', true)
      if(this.network.noConnection()){
           this.network.showNetworkAlert()
        }else{ 
           this.storage.get("id").then((id) => {
              this.platform.ready().then(() => {
                this.ga.trackEvent("Schedule Interview", "Opened", "New Session Started", id, true)
                this.ga.setAllowIDFACollection(true)
                this.ga.setUserId(id)
                this.ga.trackView("Schedule Interview")
            });
          })
          this.storage.get("Hash").then((value) => {
          this.hash = value
          let headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': this.hash
        });
        let options = new RequestOptions({ headers: headers });
          this.http.get("http://www.forehotels.com:3000/api/shortlisted_employee/"+this.id, options)
                .subscribe(data =>{
                this.items=JSON.parse(data._body).Users; //Bind data to items object\
                this.si_len= this.items.length;
              },error=>{
                    console.log(error);// Error getting the data
                } );
          });
      }  
  }
  removeItem(emp_id){
    if(this.network.noConnection()){
       this.network.showNetworkAlert()
      }else{ 
            this.storage.get("Hash").then((value)=>{
            let headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': value
          });
        let options = new RequestOptions({ headers: headers });
          this.http
          .delete("http://www.forehotels.com:3000/api/emp_wishlist/"+emp_id, options)
                .subscribe(data =>{
                  let alert = this.alertCtrl.create({
                      title: 'Candidate Removed!',
                      subTitle: 'Employee removed from schedule interview list',
                      buttons: ['OK']
                      });
                      alert.present();
                      this.loadData()
              },error=>{
                    console.log(error);// Error getting the data
                } );
          }) 
      }  
    }
  goToDetail(id){
    if(this.network.noConnection()){
           this.network.showNetworkAlert()
        }else{ 
          this.navCtrl.push(EmployeeDetailPage,{
            emp: id
          })
      }
    }  
  scheduleInterview(name,id){
    if(this.network.noConnection()){
           this.network.showNetworkAlert()
        }else{ 
        this.navCtrl.push(PageGmapAutocomplete,{
          name:name,
          emp_id:id
        })  
      }
    }
}