import { Component } from '@angular/core';
import { Platform, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Storage } from '@ionic/storage';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@Component({
  selector: 'page-my-history-report',
  templateUrl: 'my-history-report.html'
})
export class MyHistoryReportPage {
  constructor(public ga: GoogleAnalytics, 
              public platform: Platform, 
              public storage: Storage,
              public network: NetworkServiceProvider,
              public navCtrl: NavController,
              public modalCtrl: ModalController,
              public navParams: NavParams) {

              this.storage.get("id").then((id) => {
              this.platform.ready().then(() => {
                this.ga.trackEvent("My History Report", "Opened", "New Session Started", id, true)
                this.ga.setAllowIDFACollection(true)
                this.ga.setUserId(id)
                this.ga.trackView("My History Report")
            });
          })
      }
  cvDownloaded(){
        if(this.network.noConnection()){
           this.network.showNetworkAlert()
        }else{  
          let profileModal = this.modalCtrl.create(CvDownloadedPage);
            profileModal.present();
        }
      }
  jobPosted(){
    if(this.network.noConnection()){
           this.network.showNetworkAlert()
        }else{  
         let profileModal1 = this.modalCtrl.create(JobPostedPage);
            profileModal1.present();
          } 
  } 
  JobApplied(){
      if(this.network.noConnection()){
           this.network.showNetworkAlert()
        }else{  
          let profileModal3 = this.modalCtrl.create(JobsAppliedPage);
          profileModal3.present();
        }
    }
  }
@Component({
  template: `
  <style>
  .header .col {
  background-color: lightgrey;
}
.bordercol{
    border-bottom: solid 1px grey;
    border-right-style: none;
    text-align: center;
}
.bordercoltitle{
    border-bottom: solid 2px grey;
    border-top: solid 2px grey;
    border-right-style: none;
    text-align: center;
    font-style: italic;
    font-size: 1.7rem;
    font-weight: 600;
    color: #000;
}
.fnt{
      font-size: 1.6rem;
}

.col {
  border: solid 1px grey;
  border-bottom-style: none;
  border-right-style: none;
}

.col:last-child {
  border-right: solid 1px grey;
}

.row:last-child .col {
  border-bottom: solid 1px grey;
}
  </style>
   <ion-header>
  <ion-toolbar>    
    <ion-title>CV Downloaded</ion-title>
  </ion-toolbar>
</ion-header>
<ion-content>
<br>
              <ion-row style="padding-left: 1%;padding-right: 1%;" >
                  <div class="bordercoltitle" style="width: 10%;">
                    <p class="fnt">SR.</p> 
                  </div>
                  
                  <div class="bordercoltitle" style="width: 60%;">                                 
                    <p class="fnt">Employee Name</p>
                  </div>
                   <div class="bordercoltitle" style="width: 30%;">
                    <p class="fnt">Downloaded On</p>
                  </div>
                </ion-row>

                <div *ngFor="let d of datatest">
                <ion-row  style="padding-left: 1%;padding-right: 1%;">
                  <div class="bordercol" style="width: 10%;">
                  <p [innerHTML]="d.sr_no"></p> 
                  </div>
                  <div class="bordercol" style="width: 60%;">                                 
                    <p [innerHTML]="d.title"></p>
                  </div>
                   <div class="bordercol" style="width: 30%;">
                   <p *ngIf="d.date != '0000-00-00 00:00:00'" [innerHTML]="d.date | date: 'medium'" ></p>
                   <p *ngIf="d.date == '0000-00-00 00:00:00'" [innerHTML]="d.date"></p>
                  </div>
                </ion-row>
           </div>
       <br><br><br><br><br>
       <ion-item id="footer">
          <button ion-button id="footerbtn" (click)="Close()">Close</button>
       </ion-item>
</ion-content>
`
})
export class CvDownloadedPage {
    http:any
    cv:any;
    length:any;
    datatest: Array<{sr_no:any,title:any,date:any}> = [];
    constructor(http: Http,public viewCtrl: ViewController,public storage: Storage) {
      this.http = http
      this.storage.get("Hash").then((value)=>{
        this.storage.get("id").then((id)=>{
      let headers = new Headers({
       'Content-Type': 'application/x-www-form-urlencoded',
       'Authorization': value
     });
     let options = new RequestOptions({ headers: headers });
      this.http.get("http://localhost:3000/api/cv/"+id, options)
            .subscribe(data =>{
              this.cv=JSON.parse(data._body).Jobs;
              this.length = this.cv.length

         for(let i = 0; i < this.length; i++){                     
          this.datatest.push({
           sr_no: i+1,
           title:this.cv[i].name,
           date:this.cv[i].download_date, 
            });
          } 
        });
      }) 
    }) 
  }
  Close(){
    this.viewCtrl.dismiss();
  }
}
@Component({
  template: `
  <style>
  .header .col {
  background-color: lightgrey;
}
.bordercol{
    border-bottom: solid 1px grey;
    border-right-style: none;
    text-align: center;
}
.bordercoltitle{
    border-bottom: solid 2px grey;
    border-top: solid 2px grey;
    border-right-style: none;
    text-align: center;
    font-style: italic;
    font-size: 1.7rem;
    font-weight: 600;
    color: #000;
}

.col {
  border: solid 1px grey;
  border-bottom-style: none;
  border-right-style: none;
}

.col:last-child {
  border-right: solid 1px grey;
}

.row:last-child .col {
  border-bottom: solid 1px grey;
}
  </style>
   <ion-header>
  <ion-toolbar>    
    <ion-title>Jobs Posted</ion-title>
  </ion-toolbar>
</ion-header>
<ion-content>
<br>
              <ion-row style="padding-left: 1%;padding-right: 1%;" >
                  <div class="bordercoltitle" style="width: 10%;">
                    <p>SR.</p> 
                  </div>
                  
                  <div class="bordercoltitle" style="width: 30%;">                                 
                    <p>Job Posted</p>
                  </div>
                  <div class="bordercoltitle" style="width: 40%;">
                    <p>Job Role</p>
                  </div>
                   <div class="bordercoltitle" style="width: 20%;">
                    <p>Posted On</p>
                  </div>
                </ion-row>
                <div *ngFor="let d of datatest">
                <ion-row  style="padding-left: 1%;padding-right: 1%;">
                  <div class="bordercol" style="width: 10%;">
                  <p [innerHTML]="d.sr_no"></p> 
                  </div>
                  <div class="bordercol" style="width: 30%;">                                 
                    <p [innerHTML]="d.title"></p>
                  </div>
                  <div class="bordercol" style="width: 40%;">
                    <p [innerHTML]="d.role"></p>
                  </div>
                   <div class="bordercol" style="width: 20%;">
                    <p *ngIf="d.date != '0000-00-00 00:00:00'" [innerHTML]="d.date | date: 'medium'" ></p>
                    <p *ngIf="d.date == '0000-00-00 00:00:00'" [innerHTML]="d.date"></p>
                  </div>
                </ion-row>
           </div>
       <br><br><br><br><br>
       <ion-item id="footer">
          <button ion-button id="footerbtn" (click)="Close()">Close</button>
       </ion-item>
</ion-content>
`
})
export class JobPostedPage {
    http:any
    job_ps:any;
    length:any
    datatest: Array<{sr_no:any,title:any,date:any;role:any}> = [];
    constructor(
    http: Http,
    public storage: Storage,
    public viewCtrl: ViewController,
  ) {
      this.http = http
      this.storage.get("Hash").then((hash)=>{
        this.storage.get("id").then((id)=>{       
          let headers = new Headers({
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': hash
        });
        let options = new RequestOptions({ headers: headers });
          this.http.get("http://localhost:3000/api/job_posted/"+id, options)
                .subscribe(data =>{
                this.job_ps=JSON.parse(data._body).Jobs; //Bind data to items object
                this.length = this.job_ps.length            
                for(let i = 0; i < this.length; i++){
                      this.datatest.push({
                                  sr_no: i+1,
                                  title:this.job_ps[i].pname,
                                  date:this.job_ps[i].created,
                                  role:this.job_ps[i].role
                                  });
                              } 
                },error=>{
              });
          }) 
        })               
  }
  Close(){
    this.viewCtrl.dismiss();
  }
}

@Component({
  template: `
  <style>
  .header .col {
  background-color: lightgrey;
}
.bordercol{
    border-bottom: solid 1px grey;
    border-right-style: none;
    text-align: center;
}
.bordercoltitle{
    border-bottom: solid 2px grey;
    border-top: solid 2px grey;
    border-right-style: none;
    text-align: center;
    font-style: italic;
    font-size: 1.7rem;
    font-weight: 600;
    color: #000;
}

.col {
  border: solid 1px grey;
  border-bottom-style: none;
  border-right-style: none;
}

.col:last-child {
  border-right: solid 1px grey;
}

.row:last-child .col {
  border-bottom: solid 1px grey;
}
  </style>
   <ion-header>
  <ion-toolbar>    
    <ion-title>Jobs Posted</ion-title>
  </ion-toolbar>
</ion-header>
<ion-content>
<br>
              <ion-row style="padding-left: 1%;padding-right: 1%;" >
                  <div class="bordercoltitle" style="width: 10%;">
                    <p>SR.</p> 
                  </div>
                  
                  <div class="bordercoltitle" style="width: 30%;">                                 
                    <p>Employee Name</p>
                  </div>
                  <div class="bordercoltitle" style="width: 40%;">
                    <p>For Post</p>
                  </div>
                   <div class="bordercoltitle" style="width: 20%;">
                    <p>Applied On</p>
                  </div>
                </ion-row>
                <div>
                <div *ngFor="let d of datatest">
                <ion-row  style="padding-left: 1%;padding-right: 1%;">
                  <div class="bordercol" style="width: 10%;">
                  <p [innerHTML]="d.sr_no"></p> 
                  </div>
                  <div class="bordercol" style="width: 30%;">                                 
                    <p [innerHTML]="d.title"></p>
                  </div>
                  <div class="bordercol" style="width: 40%;">
                    <p [innerHTML]="d.role"></p>
                  </div>
                   <div class="bordercol" style="width: 20%;">
                   <p *ngIf="d.date != '0000-00-00 00:00:00'" [innerHTML]="d.date | date: 'medium'" ></p>
                   <p *ngIf="d.date == '0000-00-00 00:00:00'" [innerHTML]="d.date"></p>
                  </div>
                </ion-row>
           </div>
           </div>
       <br><br><br><br><br>
        <ion-item id="footer">
          <button ion-button id="footerbtn" (click)="Close()">Close</button>
        </ion-item>
</ion-content>
`
})

export class JobsAppliedPage{
    http:any
    job_ap:any;
    length:any
    datatest: Array<{sr_no:any,title:any,date:any;role:any}> = [];
    constructor(
    http: Http,
    public storage: Storage,
    public viewCtrl: ViewController,
  ) {
        this.http = http
        this.storage.get("Hash").then((hash)=>{
        this.storage.get("id").then((id)=>{
          let headers = new Headers({
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': hash
        });
        let options = new RequestOptions({ headers: headers });
          this.http.get("http://localhost:3000/api/job_applied/"+id, options)
                .subscribe(data =>{
                this.job_ap=JSON.parse(data._body).Jobs; //Bind data to items object
                this.length = this.job_ap.length
                for(let i = 0; i < this.length; i++){                     
                      this.datatest.push({
                                  sr_no: i+1,
                                  title:this.job_ap[i].ename,
                                    date:this.job_ap[i].created,
                                  role:this.job_ap[i].pname
                                  });
                              } 
                },error=>{
              } );  
          }) 
      })             
  }
  Close(){
    this.viewCtrl.dismiss();
  }
}

