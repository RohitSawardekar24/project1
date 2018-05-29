import { Component } from '@angular/core';
import { Platform, NavController, NavParams, AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { EditJobPage } from '../edit-job/edit-job';
import { Storage } from '@ionic/storage';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@Component({
  selector: 'page-view-posted-job',
  templateUrl: 'view-posted-job.html'
})
export class ViewPostedJobPage {
http:any
items:any

  constructor(public storage: Storage,http: Http,
              public navCtrl: NavController,
              public platform: Platform,
              public ga: GoogleAnalytics,
              public network: NetworkServiceProvider,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
              this.http = http
              this.loadData()
   }
    loadData(){
      if(this.network.noConnection()){
           this.network.showNetworkAlert()
        }else{ 
          this.storage.get('id').then((id)=>{
          this.storage.get("Hash").then((value)=>{
              this.platform.ready().then(() => {
              this.ga.trackEvent("View Posted Job", "Opened", "New Session Started", id, true)
              this.ga.setAllowIDFACollection(true)
              this.ga.setUserId(id)
              this.ga.trackView("View Posted Job")
          })
          let headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': value
        });
        let options = new RequestOptions({ headers: headers });
          this.http.get("http://www.forehotels.com:3000/api/job_posted/"+id, options)
                .subscribe(data =>{
                this.items=JSON.parse(data._body).Jobs; //Bind data to items object
                },error=>{
              } );
            });  
            })  
    }
  }
    editJob(hj_id){
      if(this.network.noConnection()){
           this.network.showNetworkAlert()
        }else{ 
          this.navCtrl.push(EditJobPage,{
            hj_id: hj_id
        })
      }
  }
  
  removeItem(item){
    if(this.network.noConnection()){
       this.network.showNetworkAlert()
        }else{ 
          let prompt = this.alertCtrl.create({
            title: 'Delete Post?',
            buttons: [
              {
                text: 'Cancel',
                handler: data => {
                }
              },
              {
                text: 'Delete',
                handler: data => {
                  this.callAPI(item)
                }
              }
            ]
          });
          prompt.present();
      }
  }
  callAPI(data){
    if(this.network.noConnection()){
       this.network.showNetworkAlert()
      }else{ 
          this.storage.get("Hash").then((val)=>{
          let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': val
            });
          let options = new RequestOptions({ headers: headers });
            this.http
            .delete("http:/www.forehotels.com:3000/api/jobs/"+data, options)
                  .subscribe(data =>{
                    
                    let alert = this.alertCtrl.create({
                        title: 'Job Removed!',
                        subTitle: 'Your Post has been removed successfully.',
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
}
