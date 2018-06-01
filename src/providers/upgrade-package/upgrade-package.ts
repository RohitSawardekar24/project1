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
  totaljod: any=0;
   totalpostjobs: any=0;
   counter: any=0;
   remaining_jobs: any=0;
   http: any=0;
   si_len: any=0;
   items: any=0;
   remaining_interviews: any=0;
   length: number=1;
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
              let len:number
       this.storage.get("Hash").then((value)=>{
                  this.storage.get("id").then((id)=>{
                let headers = new Headers({
                'Content-Type': 'application/json',
                'Authorization': value
              });
              let options = new RequestOptions({ headers: headers });

              this.http.get("http://www.forehotels.com:3000/api/package/"+id, options)
                  .subscribe(data =>{
                  let resitems = JSON.parse(data._body).Jobs;
                 this.totaljod = resitems[0].remaining_jobs;                   
                  len = resitems[0].remaining_interviews 
                  this.length = resitems[0].remaining_interviews
                  console.log('remaining interviews ',len)
                  }); 

                this.http.get("http://www.forehotels.com:3000/api/job_posted/"+id, options)
                .subscribe(data =>{
                this.totalpostjobs =JSON.parse(data._body).Jobs; //Bind data to items object
                let len = this.totalpostjobs.length
                console.log('total ',len)
                this.remaining_jobs = this.totaljod - len
                console.log("Remain >",this.remaining_jobs)
              })
                this.http.get("http://www.forehotels.com:3000/api/shortlisted_employee/"+id, options)
                      .subscribe(data =>{
                      this.items=JSON.parse(data._body).Users; //Bind data to items object\
                      this.si_len= this.items.length;
                        for(let i=0 ; i<this.si_len; i++){
                          if(this.items[i].is_read == '1'){
                            len1.push(this.items[i])
                          }
                        }
                        console.log('Length of SI ',len1.length)                
                        this.remaining_interviews = len - len1.length ;
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
    this.load();
      console.log('ream',this.length)
        if(this.remaining_interviews <= 0){
        console.log('if called',this.length)
        return true
      }
      else{
        return false
      }     
    }
  s_alert(){ 
    this.load();
          let alert = this.alertCtrl.create({})
          // alert.setTitle('Your remaining interviews '+this.remainig_interviews)  
          alert.setTitle('Your remaining interviews 0') ;
            alert.addButton({
              text:'Upgrade your Package',
              handler : () =>{
                this.navCtrl.push(PackagePage)
              }
            })
          alert.present() 
    }
  si_alert(){ 
    this.load();
      let alert = this.alertCtrl.create({})
      alert.setTitle('Your remaining interviews '+this.length)  
        alert.addButton({
          text:'OK',
          handler : ()=>{
            this.navCtrl.push(ScheduleInterviewPage)
          }
        })
      alert.present()
    }
 
  checkerPostJob(){     
      this.load();
          if(this.remaining_jobs <= 0){
            console.log('if called')
            return true
          }else{
            console.log('else called')
            return false
          }
    }
  resalert(){     
    this.load();    
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
    this.load();
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
