import { Component } from '@angular/core';
import { Platform, NavController, NavParams, AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Validators, FormBuilder } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@Component({
  selector: 'page-edit-job',
  templateUrl: 'edit-job.html'
})
export class EditJobPage {
http:any
items:any
hj_id:any;
postJobForm:any
  constructor(public storage: Storage,
              public alertCtrl: AlertController,
              private form: FormBuilder,
              http: Http,
              public network: NetworkServiceProvider,
              public platform: Platform,
              public ga: GoogleAnalytics,
              public navCtrl: NavController, 
              public navParams: NavParams) {
              this.storage.get("id").then((id) => {
              this.platform.ready().then(() => {
                this.ga.trackEvent("Edit Job", "Opened", "New Session Started", id, true)
                this.ga.setAllowIDFACollection(true)
                this.ga.setUserId(id)
                this.ga.trackView("Edit Job")
              });
          })

      this.hj_id = this.navParams.get('hj_id')
      this.http = http
       this.postJobForm = this.form.group({
      "pname":["", Validators.required],
      "role":["", Validators.required],
      "key_skils":["", Validators.required],
      "job_desc":["",Validators.required],
      "education":["",Validators.required],
      "tips":["",Validators.required],
      "salary_range":["",Validators.required],
      "service_charge":["",Validators.required],
      "incentives":["",Validators.required],
      "staff_room":["",Validators.required],
      "pf":["",Validators.required]
   })
    if(this.network.noConnection()){
       this.network.showNetworkAlert()
      }else{
            this.storage.get("Hash").then((value)=>{
            let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': value
          });
          let options = new RequestOptions({ headers: headers });
            this.http.get("http://www.forehotels.com:3000/api/jobs/"+this.hj_id, options)
                  .subscribe(data =>{
                  this.items=JSON.parse(data._body).Jobs;
                  },error=>{
                } );
              });  
      } 
  }
     pname(){
            let prompt = this.alertCtrl.create({
            title: 'Post Name',
            inputs: [
              {
                value: this.items["0"].pname
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
                handler: pname => {
                this.items["0"].pname = pname["0"];
                  this.callAPI("pname", pname["0"])
                }
              }
            ]
          });
          prompt.present();
      } 
    min_experience(){
          let prompt = this.alertCtrl.create({
          title: 'Minimum Experience',
          inputs: [
            {
              value: this.items["0"].min_experience
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
              handler: min_experience => {
                this.items["0"].min_experience = min_experience["0"];
                this.callAPI("min_experience", min_experience["0"])
              }
            }
          ]
        });
        prompt.present();
    }  
    max_experience(){
          let prompt = this.alertCtrl.create({
          title: 'Maximum Experience',
          inputs: [
            {
              value: this.items["0"].max_experience
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
              handler: max_experience => {
                this.items["0"].max_experience = max_experience["0"];
                this.callAPI("max_experience", max_experience["0"])
              }
            }
          ]
        });
        prompt.present();
    }     
    role(){
          let prompt = this.alertCtrl.create({
          title: 'Role',
          inputs: [
            {
              value: this.items["0"].role
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
              handler: role => {
                this.items["0"].role = role["0"];
                this.callAPI("role", role["0"])
              }
            }
          ]
        });
        prompt.present();
    } 
   education(){
          let prompt = this.alertCtrl.create({
          title: 'Education',
          inputs: [
            {
              value: this.items["0"].education
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
              handler: education => {
                this.items["0"].education = education["0"];
                this.callAPI("education", education["0"])
              }
            }
          ]
        });
        prompt.present();
    }         
  job_desc(){
          let prompt = this.alertCtrl.create({
          title: 'Job Description',
          inputs: [
            {
              value: this.items["0"].job_desc
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
              handler: job_desc => {
                this.items["0"].job_desc = job_desc["0"];
                this.callAPI("job_desc", job_desc["0"])
              }
            }
          ]
        });
        prompt.present();
    }
    salary_range(){
              let prompt = this.alertCtrl.create({
              title: 'Salary Range',
              inputs: [
                {
                  value: this.items["0"].salary_range
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
                  handler: salary_range => {
                    this.items["0"].salary_range = salary_range["0"];
                    this.callAPI("salary_range", salary_range["0"])
                  }
                }
              ]
            });
            prompt.present();
      }
    key_skills(){
          let prompt = this.alertCtrl.create({
          title: 'Key Skills',
          inputs: [
            {
              value: this.items["0"].key_skils
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
              handler: key_skils => {
                this.items["0"].key_skils = key_skils["0"];
                this.callAPI("key_skils", key_skils["0"])
              }
            }
          ]
        });
        prompt.present();
  }

    callAPI(key,value){
      if(this.network.noConnection()){
           this.network.showNetworkAlert()
        }else{
            this.storage.get("Hash").then((hash)=>{
            let body = JSON.stringify({
                  key: key,
                  value: value,
                  hj_id: this.hj_id
                  });
            let headers = new Headers({
              'Content-Type': 'application/json',
              'Authorization': hash
            });
            let options = new RequestOptions({ headers: headers });

            this.http
                .put('http://www.forehotels.com:3000/api/hotel_job', body, options)
                .map(res => res.json())
                .subscribe(
                    data => {
                      console.log(data);
                    },
                    err => {
                      console.log("ERROR!: ", err);
                    }
                );
              }) 
            }   
    } 
}
