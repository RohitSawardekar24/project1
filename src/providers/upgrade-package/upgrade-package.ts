import { Injectable, Injector } from '@angular/core';
import { Http, Headers, RequestOptions  } from '@angular/http';
import { AlertController , NavController, App } from 'ionic-angular';
import { PackagePage } from '../../pages/package/package'
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { PostJobPage } from '../../pages/post-job/post-job';
import { ScheduleInterviewPage } from '../../pages/schedule-interview/schedule-interview'


@Injectable()
export class UpgradePackageProvider {
  totaljod: any;
   totalpostjobs: any;
   counter: any;
   remaining_jobs: any;
   http: any;
   si_len: any;
   items: any;
   remainig_interviews: any;
  constructor(protected app: App,
              http: Http,
              public storage: Storage,
              protected injector: Injector,
              public alertCtrl:AlertController) {
              this.http= http             
    console.log('Hello UpgradePackageProvider Provider');   
  }
  
 get navCtrl(): NavController {
    return this.app.getRootNav();
  }

  load(){
     let len1 =[]
              let len:any
       this.storage.get("Hash").then((value)=>{
                  this.storage.get("id").then((id)=>{
                let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': value
              });
              let options = new RequestOptions({ headers: headers });

              this.http.get("http://localhost:3000/api/package/"+id, options)
                  .subscribe(data =>{
                  let resitems = JSON.parse(data._body).Jobs;
                 this.totaljod = resitems[0].remaining_jobs;                   
                  len = resitems[0].remaining_interviews 
                  console.log('remaining interviews ',len)
                  }); 

                this.http.get("http://localhost:3000/api/job_posted/"+id, options)
                .subscribe(data =>{
                this.totalpostjobs =JSON.parse(data._body).Jobs; //Bind data to items object
                let len = this.totalpostjobs.length
                console.log('total ',len)
                this.remaining_jobs = this.totaljod - len
                console.log("Remain >",this.remaining_jobs)
              })
                this.http.get("http://localhost:3000/api/shortlisted_employee/"+id, options)
                      .subscribe(data =>{
                      this.items=JSON.parse(data._body).Users; //Bind data to items object\
                      this.si_len= this.items.length;
                        for(let i=0 ; i<this.si_len; i++){
                          if(this.items[i].is_read == '1'){
                            len1.push(this.items[i])
                          }
                        }
                        console.log('Length of SI ',len1.length)                
                        this.remainig_interviews = len - len1.length 
                    })
              })
          })
  }
  
   upgradepackage(){
     let prompt = this.alertCtrl.create({
            subTitle: 'Upgrade your Plan to view more details!',
            buttons: [
              {
                text: 'Cancel',
                handler: data => {
                }
              },
              {
                text: 'Upgrade',
                handler: name => {
                  this.navCtrl.push(PackagePage)
                }
              }
            ]
          });
          prompt.present();
  }

  interviewAlert(){
    this.load()
      console.log('ream',this.remainig_interviews)
        if(this.remainig_interviews == 0){
        console.log('if called',this.remainig_interviews)
        return true
      }
      else{
        return false
      }     
    }
  s_alert(){ 
          let alert = this.alertCtrl.create({})
          alert.setTitle('Your remaining interviews '+this.remainig_interviews)  
            alert.addButton({
              text:'Upgrade your Package',
              handler : () =>{
                this.navCtrl.push(PackagePage)
              }
            })
          alert.present() 
    }
  si_alert(){ 
      let alert = this.alertCtrl.create({})
      alert.setTitle('Your remaining interviews '+this.remainig_interviews)  
        alert.addButton({
          text:'OK',
          handler : ()=>{
            this.navCtrl.push(ScheduleInterviewPage)
          }
        })
      alert.present()
    }
 
  checkerPostJob(){     
      this.load()
          if(this.remaining_jobs == 0){
            console.log('if called')
            return true
          }else{
            console.log('else called')
            return false
          }
    }
  resalert(){         
          let alert = this.alertCtrl.create({}) 
                    alert.setTitle('Your Remaining Jobs ' + this.remaining_jobs)                    
                      alert.addButton({
                        text: 'Upgrade your package',
                        handler: () =>{
                          this.navCtrl.push(PackagePage)                          
                        }
                      })
                     alert.present();
        }
        
  sucalert(){
          let alert = this.alertCtrl.create({})             
              alert.setTitle('Your Remaining Jobs ' + this.remaining_jobs)
              alert.addButton({
                text: 'Okay',
                handler:()=>{
                  this.navCtrl.push(PostJobPage)
                }
              })
              alert.present();
        }
}
