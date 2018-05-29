import { Component } from '@angular/core';
import { Platform, NavController, NavParams, AlertController, ModalController, ViewController, LoadingController,PopoverController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Validators, FormBuilder } from '@angular/forms';
import { City } from '../../providers/city/city';
import { ListPage } from '../list/list';
import 'rxjs/add/operator/debounceTime';
import { FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'page-catering-requirement',
  templateUrl: 'catering-requirement.html'
})
export class CateringRequirementPage {
   http:any
   rows: any;
   resitems:any
   service= []
   kitchen= []
   bartender= []
   front_office=[]
   hk=[]
   other=[]
   pages: Array<{title: any, img:any}>;
 constructor(public navCtrl: NavController,
             http: Http,
             public viewCtrl: ViewController, 
             public storage:Storage,
             public platform: Platform,
             public ga: GoogleAnalytics,
             public network: NetworkServiceProvider,
             public loadingCtrl: LoadingController) {
             this.http = http;              
        if(this.network.noConnection()){
           this.network.showNetworkAlert()
          }else{

            this.storage.get("id").then((id) => {
                this.platform.ready().then(() => {
                  this.ga.trackEvent("Catering Requirement", "Opened", "New Session Started", id, true)
                  this.ga.setAllowIDFACollection(true)
                  this.ga.setUserId(id)
                  this.ga.trackView("Catering Requirement")
                });
            })
             this.storage.get('Hash').then((hash) => {    
              let loader = this.loadingCtrl.create({
              spinner: 'bubbles',
              content: 'Fetching Posts...'
              }); 
              loader.present()            
              let headers = new Headers({
              'Content-Type': 'application/json',
              'Authorization': hash
            });
            let options = new RequestOptions({ headers: headers });
              this.http.get("http://www.forehotels.com:3000/api/designation", options)
                    .subscribe(data =>{
                    this.resitems=JSON.parse(data._body);
                    for(let i=0;i<this.resitems.length; i++){
                      if(this.resitems[i].parent_id == 2){
                      this.service.push(this.resitems[i])
                    }
                      if(this.resitems[i].parent_id == 4){
                        this.kitchen.push(this.resitems[i])
                      }
                      if(this.resitems[i].parent_id == 3){
                        this.bartender.push(this.resitems[i])
                      }
                      if(this.resitems[i].parent_id == 1){
                        this.front_office.push(this.resitems[i])
                      }
                      if(this.resitems[i].parent_id == 5){
                        this.hk.push(this.resitems[i])
                      }
                      if(this.resitems[i].parent_id == 6){
                        this.other.push(this.resitems[i])
                      }
                  }
              loader.dismiss()
              this.rows = Array.from(Array(Math.ceil(this.resitems.length/3)).keys());
            });
        });
     }
}

selectvalue(data){
      if(this.network.noConnection()){
           this.network.showNetworkAlert()
       }else{      
        this.navCtrl.push(CityPage,{
        designation: data.designation,
        parent_id: data.parent_id,
      },{animate:true,animation:'transition',duration:500,direction:'forward'})
    }
  }  
}

/****************End-Post-Jobs**************/

/***************Select City***************/
@Component({
  template: `
  <ion-header>
  <ion-navbar color="primary">
    <ion-title>
      Select City
    </ion-title>
  </ion-navbar>
</ion-header>
 
<ion-content>
 
    <ion-searchbar [(ngModel)]="searchTerm" [formControl]="searchControl" (ionInput)="onSearchInput()"></ion-searchbar>
 
    <div *ngIf="searching" class="spinner-container">
        <ion-spinner></ion-spinner>
    </div>
 
    <ion-list>
        <ion-item *ngFor="let item of items" (click)="onclick(item)">
            {{item.city_name}}
        </ion-item>
    </ion-list>
 
</ion-content>
`
})
export class CityPage {
  searchTerm: string = '';
    searchControl: FormControl;
    items: any;
    city: any;
    searching: any = false;
    designation: any;
    parent_id: any;

constructor(public navCtrl: NavController, 
            public dataService: City, 
            public network: NetworkServiceProvider,
            public viewCtrl: ViewController, 
            public navParams: NavParams) {
            this.designation = navParams.get('designation')
            this.parent_id = navParams.get('parent_id')            
            this.searchControl = new FormControl();
    }
 
ionViewDidLoad() { 
        this.setFilteredItems(); 
        this.searchControl.valueChanges.debounceTime(700).subscribe(search => { 
            this.searching = false;
            this.setFilteredItems();
        });
  }
 onclick(item){
      if(this.network.noConnection()){
         this.network.showNetworkAlert()
        }else{      
        this.navCtrl.push(CateringExperiencePage,{
          designation: this.designation,
          parent_id: this.parent_id,
          job_city: item.c_id,          
        },{animate:true,animation:'transition',duration:500,direction:'forward'})
    }
  }

  onSearchInput(){
        this.searching = true;
  }
 
  setFilteredItems() {
        if(this.network.noConnection()){
           this.network.showNetworkAlert()
          }else{
        this.items = this.dataService.filterItems(this.searchTerm);
    }
  }
}
/****************Select City-End**************/

/****************No. of Heads/Minimum Exp./Maximum Exp.**************/
@Component({
  template: `
  <style>
  .card-header-md {
    font-size: 1.6rem;
    color: #222;
    padding: 5px;
}
  </style>
  <ion-content>
 <ion-list>

  <ion-card style="box-shadow: 0 4px 10px rgba(19, 150, 226, 0.6);">
  <ion-card-header>  
 
  <ion-item><ion-icon name="ios-calendar-outline" item-start></ion-icon>
  <ion-label style="color:black;font-weight: 800;">Date & Time of Requirement</ion-label>
      </ion-item>
      </ion-card-header>
      <ion-card-content> 
      <ion-list style="margin-top: -16px;">    
      <ion-datetime displayFormat="DDDD MMM  D, YYYY- hh:mm A" [(ngModel)]=myDate (ionChange)='ChangeDate(myDate)'></ion-datetime>
      </ion-list>
      </ion-card-content>
  </ion-card>
  
    <ion-card style="box-shadow: 0 4px 10px rgba(19, 150, 226, 0.6);">
          <ion-card-header>  
            <ion-list style="margin: 0px 0 0px;"  >
                <ion-item>
                  <ion-icon name="ios-man-outline" item-start></ion-icon>
                  <ion-label style="font-siz
                  e: 21px;font-weight: 800;letter-spacing: 0.5px;">Number of Catering Heads</ion-label>
              </ion-item>
            </ion-list>
          </ion-card-header>     
       <ion-card-content>
            <ion-list style="margin-top: -16px;">                                    
                  <button ion-button style="color: black;text-transform: none;" color="light" (click)="presentPopoverNoOfHeadds($event)" clear icon-right>
                    Select Your Number of heads &nbsp;&nbsp;{{this.no_of_heads}} 
                  <ion-icon style="color: black;" name="ios-arrow-down-outline"></ion-icon>          
                </button>
            </ion-list>
          </ion-card-content>
    </ion-card>

    <ion-list style="margin: 0px 0 0px;">

        <ion-card *ngIf="this.view == true" style="box-shadow: 0 4px 10px rgba(19, 150, 226, 0.6);">
          <ion-card-header>  
            <ion-list style="margin: 0px 0 0px;"  >
                <ion-item>
                  <ion-icon name="ios-briefcase-outline" item-start></ion-icon>
                  <ion-label style="font-size: 21px;font-weight: 800;letter-spacing: 0.5px;">Experience</ion-label>
              </ion-item>
            </ion-list>
          </ion-card-header>
      <ion-card-content>
        <ion-grid style="margin-top: -25px;">
              <ion-row> 
                  <ion-col style="display:flex">                     
                      <button ion-button style="color: black;text-transform: none;" color="light" (click)="presentPopoverMinimum($event)" clear icon-right>
                        Minimum &nbsp;&nbsp;{{this.minValue}}
                      <ion-icon style="color: black;" name="ios-arrow-down-outline"></ion-icon>
                    </button>
                  </ion-col>
                  <ion-col *ngIf="this.maximum == true">
                        <button ion-button style="color: black;text-transform: none;" color="light" (click)="presentPopoverMaximum($event)" clear icon-right>
                        Maximum &nbsp;&nbsp;{{this.maxValue}}
                      <ion-icon style="color: black;" name="ios-arrow-down-outline"></ion-icon>          
                    </button>                  
                  </ion-col>
              </ion-row>
        </ion-grid>
      </ion-card-content>
    </ion-card>
       <ion-card *ngIf="this.view2 == true" style="box-shadow: 0 4px 10px rgba(19, 150, 226, 0.6);">
          <ion-card-header>  
            <ion-list>
                <ion-item>
                  <ion-icon name="ios-cash-outline" item-start></ion-icon>
                  <ion-label style="font-size: 21px;font-weight: 800;letter-spacing: 0.5px;">Wages Per Day</ion-label>
              </ion-item>
            </ion-list>
          </ion-card-header>
          <ion-card-content>
            <ion-list style="margin-top: -16px;">                                    
                  <button ion-button style="color: black;text-transform: none;" color="light" (click)="presentPopoverSalary($event)" clear icon-right>
                    Select Your Salary Range &nbsp;&nbsp;{{this.selectedSalary}} 
                  <ion-icon style="color: black;" name="ios-arrow-down-outline"></ion-icon>          
                </button>
            </ion-list>
          </ion-card-content>
        </ion-card>
    </ion-list>
   
</ion-list>
</ion-content>
`
})
export class CateringExperiencePage {
  selectedSalary:any
  minValue: any;
  maxValue: any;
  i:any
  no_of_heads: any;
  view: boolean= false;
  view2: boolean= false;  
  maximum: boolean = false;
  designation: any;
  job_city: any;
  parent_id: any;
  myDate: String = new Date().toISOString()

constructor(public navCtrl: NavController,
            public navParams: NavParams, 
            public network: NetworkServiceProvider,
            public popoverCtrl: PopoverController, 
            public alertCtrl: AlertController) {              
            this.maxValue = "0"
            this.minValue = "0"
            this.selectedSalary= "0" 
            this.no_of_heads= "0";          
            this.designation = navParams.get('designation')
            this.parent_id = navParams.get('parent_id')
            this.job_city = navParams.get('job_city')           
}

ChangeDate(date){
  if(this.network.noConnection()){
     this.network.showNetworkAlert()
    }else{    
    window.localStorage.setItem('DateTime',date)
    }
}


presentPopoverNoOfHeadds(myEvent){
    let popover = this.popoverCtrl.create(CateringPopoverPageNoOfHeadds);
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss((data)=>{      
        this.no_of_heads = data;
        if(this.no_of_heads != null){
          this.view = true;
        }        
   })
}

 presentPopoverMaximum(myEvent) {
    let popover = this.popoverCtrl.create(CateringPopoverPageMaximum);
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss((data)=>{
        this.maxValue = data;
        if(this.maxValue != null){
           this.view2 = true
        }
    })
  }

   presentPopoverMinimum(myEvent) {
    let popover = this.popoverCtrl.create(CateringPopoverPageMinimum);
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss((data)=>{
        this.minValue = data;
        if(this.minValue != null){
          this.maximum = true
        }
      })
  }

   presentPopoverSalary(myEvent) {
    let popover = this.popoverCtrl.create(CateringPopoverPageSalary,{no_of_heads: this.no_of_heads,
                                                             min: this.minValue,
                                                             max: this.maxValue,                                                             
                                                             designation: this.designation,
                                                             parent_id: this.parent_id,
                                                             job_city: this.job_city,
                                                             });
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss((data)=>{
        this.selectedSalary= data;
    })
  }
  
}
/****************No. of Heads/Minimum Exp./Maximum Exp.-End**************/


/****************Number of Heads End**************/
@Component({
  template: `  
    <ion-list>
        <ion-list-header>Select Number Of Heads</ion-list-header>      
        <button ion-item *ngFor="let i of NoHeads" (click)="updateNumber(i)">{{i}}</button>      
    </ion-list>
  `
})
export class CateringPopoverPageNoOfHeadds {
 NoHeads=[]
  constructor(public viewCtrl: ViewController, public network: NetworkServiceProvider) {
      for(let i=1; i<21; i++){
        this.NoHeads.push(i)  
      }
  }        
  updateNumber(item) {
    if(this.network.noConnection()){
       this.network.showNetworkAlert()
      }else{
        this.viewCtrl.dismiss(item);
    }
  }
}
/****************Number Of Heads End**************/

/****************Minimum Experience**************/
@Component({
  template: `
    <ion-list>
      <ion-list-header>Select Minimum Experience</ion-list-header>
      <button ion-item *ngFor="let i of min_exp" (click)="close(i)">{{i}}</button> 
    </ion-list>
  `
})
export class CateringPopoverPageMinimum {
 min_exp=[]
  constructor(public viewCtrl: ViewController, public network: NetworkServiceProvider) {
      for(let i=1; i<41; i++){
        this.min_exp.push(i)  
      }
  }        
  close(item) {
    if(this.network.noConnection()){
       this.network.showNetworkAlert()
      }else{
        this.viewCtrl.dismiss(item);
        window.localStorage.setItem('MinV',item);
    }
  }
}
/****************Minimum Experience-End**************/

/****************Maximum Experience**************/
@Component({
  template: `
    <ion-list>
      <ion-list-header>Select Maximum Experience</ion-list-header>
      <button ion-item *ngFor="let i of max_exp" (click)="close(i)">{{i}}</button>

    </ion-list>
  `
})
export class CateringPopoverPageMaximum {
  max_exp= [];
  constructor(public viewCtrl: ViewController, public network: NetworkServiceProvider) {
    let i;
    for( i= (window.localStorage.getItem('MinV')); i<= 41; i++){
      this.max_exp.push(i)
    }
  }

  close(item) {
    if(this.network.noConnection()){
       this.network.showNetworkAlert()
      }else{
      this.viewCtrl.dismiss(item);
    }
  }
}
/****************Maximum Experience-End**************/

/****************Salary Range**************/
@Component({
  template: `
    <ion-list>      
          <ion-list-header>Select Wages</ion-list-header>
      <button ion-item *ngFor="let item of Sal" (click)="close(item)">{{item}}</button>      
    </ion-list>
  `
})
export class CateringPopoverPageSalary {
  salaryList: any;
  Sal=[]
  add: any;
  Position: any;
  min: any;
  max: any;
  no_of_heads: any;
  designation: any;
  parent_id: any;
  job_city: any;
  dateTime: any;

  constructor(public viewCtrl: ViewController, 
              public navCtrl: NavController,
              public navParams: NavParams,
              public network: NetworkServiceProvider) {      
      this.no_of_heads = navParams.get('no_of_heads')  
      this.min = navParams.get('min')
      this.max = navParams.get('max')
      this.designation = navParams.get('designation')
      this.parent_id = navParams.get('parent_id')
      this.job_city = navParams.get('job_city')   
      this.dateTime = window.localStorage.getItem('DateTime')      
      for(let i=100; i<=2000; i+=100){     
          this.Sal.push(i)   ;
      }      
  }  
  close(selectedSalaryItem) {
    if(this.network.noConnection()){
       this.network.showNetworkAlert()
      }else{    
      this.viewCtrl.dismiss(selectedSalaryItem);
        setTimeout(() => {
          this.navCtrl.push(CateringEducationAndRolePage,{
            salary_range: selectedSalaryItem,
            dateTime: this.dateTime,      
            min: this.min,
            max: this.max,
            no_of_heads: this.no_of_heads,
            designation: this.designation,
            parent_id: this.parent_id,
            job_city: this.job_city,
          },{animate:true,animation:'transition',duration:500,direction:'forward'})  
        }, 1500)
      }
  }
}
/****************Salary Range-End**************/

/****************Education**************/
@Component({
  template: `
  <ion-content>
  <ion-list radio-group>
  <ion-list-header style="font-weight:bold">
    Education
  </ion-list-header>

  <ion-item>
    <ion-label>Below 10th</ion-label>
    <ion-radio (click)="selectvalue('Below 10th')"></ion-radio>
  </ion-item>

  <ion-item>
    <ion-label>10th</ion-label>
    <ion-radio (click)="selectvalue('10th')"></ion-radio>
  </ion-item>

  <ion-item>
    <ion-label>12th</ion-label>
    <ion-radio (click)="selectvalue('12th')"></ion-radio>
  </ion-item>

  <ion-item>
    <ion-label>Below 12th</ion-label>
    <ion-radio (click)="selectvalue('Below 12th')"></ion-radio>
  </ion-item>

  <ion-item>
    <ion-label>Degree in Hotel Management</ion-label>
    <ion-radio (click)="selectvalue('Degree in Hotel Management')"></ion-radio>
  </ion-item>

  <ion-item>
    <ion-label>BSc. in Hotel Management</ion-label>
    <ion-radio (click)="selectvalue('BSc. in Hotel Management')"></ion-radio>
  </ion-item>
  
  <ion-item>
    <ion-label>Other</ion-label>
    <ion-radio (click)="selectvalue('Other')"></ion-radio>
  </ion-item>
</ion-list>
</ion-content>`
})
export class CateringEducationAndRolePage{
  salary_range: any;
  min: any;
  max: any;
  no_of_heads: any;
  designation: any;
  parent_id: any;
  job_city: any;
  dateTime: any;  
  salary: any;

  constructor(public navParams: NavParams, 
              public navCtrl: NavController,
              public network: NetworkServiceProvider) {         
              this.salary_range = navParams.get('salary_range')
              this.min = navParams.get('min')
              this.max = navParams.get('max')
              this.no_of_heads = navParams.get('no_of_heads')        
              this.designation = navParams.get('designation')
              this.parent_id = navParams.get('parent_id')
              this.job_city = navParams.get('job_city') 
              this.dateTime = navParams.get('dateTime')
 }

  selectvalue(item){
      if(this.network.noConnection()){
           this.network.showNetworkAlert()
          }else{
          this.navCtrl.push(CateringRolePage,{
                  education: item,
                  salary_range: this.salary_range,
                  dateTime: this.dateTime,      
                  min: this.min,
                  max: this.max,
                  no_of_heads: this.no_of_heads,
                  designation: this.designation,
                  parent_id: this.parent_id,
                  job_city: this.job_city,
          },{animate:true,animation:'transition',duration:500,direction:'forward'})
        }
    }
}
/****************Education-End**************/

/****************Role**************/
@Component({
  template: `
<ion-content> 

    <ion-list radio-group>
      <ion-list-header style="font-weight:bold">
        Role
      </ion-list-header>
<!----------FOR F&B SERVICE------ --------->
      <div *ngIf="parent_id==2">         
        <ion-item *ngFor="let p of services">
          <ion-label style="white-space:pre-wrap">{{p}}</ion-label>
          <ion-checkbox (ionChange)="updateCheckedOptions($event, p)" [checked]="cbChecked.indexOf(p) >= 0"></ion-checkbox>
        </ion-item>
      </div>
<!------FOR BARTENDER---------->
        <div *ngIf="parent_id==3">    
      <ion-item *ngFor="let p of bartender">
          <ion-label style="white-space:pre-wrap">{{p}}</ion-label>
          <ion-checkbox (ionChange)="updateCheckedOptions($event, p)" [checked]="cbChecked.indexOf(p) >= 0"></ion-checkbox>
        </ion-item>
      </div>
<!------FOR KITCHEN----->
      <div *ngIf="parent_id==4"> 
      <ion-item *ngFor="let p of kitchen">
          <ion-label style="white-space:pre-wrap">{{p}}</ion-label>
          <ion-checkbox (ionChange)="updateCheckedOptions($event, p)" [checked]="cbChecked.indexOf(p) >= 0"></ion-checkbox>
        </ion-item>
      </div>
<!-----------------FOR FRONT_OFFICE----------->
      <div *ngIf="parent_id==1">
      <ion-item *ngFor="let p of front_office">
          <ion-label style="white-space:pre-wrap">{{p}}</ion-label>
          <ion-checkbox (ionChange)="updateCheckedOptions($event, p)" [checked]="cbChecked.indexOf(p) >= 0"></ion-checkbox>
        </ion-item>
      </div>
<!--------------------------FOR House_Keeping------------>
      <div *ngIf="parent_id==5">
      <ion-item *ngFor="let p of hk">
          <ion-label style="white-space:pre-wrap">{{p}}</ion-label>
          <ion-checkbox (ionChange)="updateCheckedOptions($event, p)" [checked]="cbChecked.indexOf(p) >= 0"></ion-checkbox>
        </ion-item>
      </div>
<!-----------------------FOR OTHERS-------------->
        <div *ngIf="parent_id==6">
        <ion-item *ngFor="let p of others">
          <ion-label style="white-space:pre-wrap">{{p}}</ion-label>
          <ion-checkbox (ionChange)="updateCheckedOptions($event, p)" [checked]="cbChecked.indexOf(p) >= 0"></ion-checkbox>
        </ion-item>
      </div>
    </ion-list>

    <ion-item>
        <ion-label color="primary" stacked>Any other role</ion-label>
        <ion-textarea [value]="title" [(ngModel)]="title" name="title" type="text"></ion-textarea>
    </ion-item>
  <br>
    <ion-list style="text-align: center;">
    <button ion-button large (click)="moveNext()">Next</button>
  </ion-list>  
</ion-content>`
})
export class CateringRolePage{
  salary_range: any;
  dateTime: any;
  min: any;
  max: any;
  no_of_heads: any;
  designation: any;
  parent_id: any;
  job_city: any;
  education:any;
  title: any;  
  cbArr: string[];
  cbChecked: string[];
  services= [];
  bartender=[]
  kitchen=[]
  front_office=[]
  hk=[]
  others=[]
   constructor(public navParams: NavParams,
               public navCtrl: NavController,
               public network: NetworkServiceProvider,
               http: Http,public viewCtrl: ViewController,
               public toastCtrl: ToastController,
               public loadingCtrl: LoadingController) {
              this.services =[
                'Assist guest with table reservation',
                'Has a good knowledge of menu and presentation standards',
                'Serve food courses and beverages to guests',
                'Able to answer any questions regarding menu and assist with menu selections',
                'Present accurate final bill to guest and process payment']
              this.bartender=[
                'Interact with customers, take orders for drinks and snacks',
                'Mix ingredients to prepare cocktails and other drinks',
                'Prepare alcohol or non-alcohol beveragesKeep the bar counter and work area neat and clean at all times',
                'Wash glassware and utensils after each use',
                'Maintain liquor inventory and consumption']
              this.kitchen=[
                'Responsible to supervise junior chefs or commis',
                'Ensure that the production, preparation and presentation of food are of the highest quality at all times',
                'Consults daily with Sous Chef and Executive chef on the daily requirements',
                'To be aware of all financial budgets and goals',
                'Ensure effective communication between staff by maintaining a secure and friendly working environment',
                'Carry out any other duties as required by management']
              this.front_office=[
                'Welcome guests during check-in and giving a found farewell to guest while checkout',
                'Handling guest complaints and concerns in an efficient and timely manner',
                'Detailed information regarding arrivals and room requirements',
                'Providing excellent customer service as per hotel standards',
                'Co-ordinate with housekeeping for clearing of rooms',
                'Good command of the English language is essential, both written and verbal']
              this.hk=[
                'Supervise Room Attendants',
                'Organises and facilitates the room making process',
                'Responsible for the cleanliness of guest rooms, corridors and area of floor',
                'Report maintenance issues to Maintenance/Engineering Department',
                'Co-ordinate with housekeeping for clearing of rooms',
                'Routine inspection of guest bedrooms to ensure they meet standards']
              this.others=[
                'Maintain and promote a team work environment with effective and clear communication amongst co-workers',
                'Follow and track company cross-sell procedures',
                'Creating a focus on attracting new business',
                'Ensure Guests are aware of all services and activities available',
                'Provide a high level of Guest satisfaction and safety through effective communication']
              this.cbChecked = [];
              this.salary_range = navParams.get('salary_range')
              this.dateTime = navParams.get('dateTime')
              this.min = navParams.get('min')
              this.max = navParams.get('max')
              this.no_of_heads = navParams.get('no_of_heads')        
              this.designation = navParams.get('designation')
              this.parent_id = navParams.get('parent_id')
              this.job_city = navParams.get('job_city')
              this.education = navParams.get('education')
}
                
updateCheckedOptions(e: any,data) {
        var list = this.cbChecked.indexOf(e)
        if(e.checked){
          this.cbChecked.push(data)
        }else{
         var ind = this.cbChecked.indexOf(data)
            this.cbChecked.splice(ind, 1);
          }
      }
    
moveNext(){
  if(this.network.noConnection()){
     this.network.showNetworkAlert()
     }else{
      if(this.title != null){
        this.cbChecked.push(this.title)
      }
      if(this.cbChecked.length > 0){
              this.navCtrl.push(CateringKeySkillsPage,{
                    cbarray: this.cbChecked,
                    education: this.education,
                    salary_range: this.salary_range,   
                    dateTime: this.dateTime,   
                    min: this.min,
                    max: this.max,
                    no_of_heads: this.no_of_heads,
                    designation: this.designation,
                    parent_id: this.parent_id,
                    job_city: this.job_city,
            },{animate:true,animation:'transition',duration:500,direction:'forward'})
          }else{
            let toast = this.toastCtrl.create({
                message: 'Please Select a Value',
                duration: 5000,
                position: 'bottom',
              });
              toast.present();
        }
    }
  }
}

@Component({
  template: `
<ion-content> 
  <ion-list radio-group>

  <ion-list-header style="font-weight:bold">
    Key Skills
  </ion-list-header>
<!-------------------------------FOR SERVICE--------------------->
      <div *ngIf="parent_id==2">
          <ion-item *ngFor="let s of service">
            <ion-label style="white-space:pre-wrap">{{s}}</ion-label>
            <ion-checkbox (ionChange)="updateCheckedOptions($event, s)" [checked]="keyarray.indexOf(s) >= 0"></ion-checkbox>
          </ion-item>  
        </div>

  <!------FOR BARTENDER---------->
          <div *ngIf="parent_id==3">
            <ion-item *ngFor="let b of bartender">
              <ion-label style="white-space:pre-wrap">{{b}}</ion-label>
              <ion-checkbox (ionChange)="updateCheckedOptions($event, b)" [checked]="keyarray.indexOf(b) >= 0"></ion-checkbox>
            </ion-item>
        </div>

  <!------FOR KITCHEN----->
        <div *ngIf="parent_id==4">  
          <ion-item *ngFor="let k of kitchen">
            <ion-label style="white-space:pre-wrap">{{k}}</ion-label>
            <ion-checkbox (ionChange)="updateCheckedOptions($event, k)" [checked]="keyarray.indexOf(k) >= 0"></ion-checkbox>
          </ion-item>
      </div>      
  
<!-----------------FOR FRONT_OFFICE----------->
      <div *ngIf="parent_id==1">      
        <ion-item *ngFor="let f of frontOffice">
          <ion-label style="white-space:pre-wrap">{{f}}</ion-label>
          <ion-checkbox (ionChange)="updateCheckedOptions($event, f)" [checked]="keyarray.indexOf(f) >= 0"></ion-checkbox>
        </ion-item>
    </div>
  

  <!--------------------------FOR House_Keeping------------>
      <div *ngIf="parent_id==5">        
            <ion-item *ngFor="let h of housekeep">
              <ion-label style="white-space:pre-wrap">{{h}}</ion-label>
              <ion-checkbox (ionChange)="updateCheckedOptions($event, h)" [checked]="keyarray.indexOf(h) >= 0"></ion-checkbox>
            </ion-item>
      </div>
  

  <!-----------------------FOR OTHERS-------------->
      <div *ngIf="parent_id==6">        
          <ion-item *ngFor="let o of others">
            <ion-label style="white-space:pre-wrap">{{o}}</ion-label>
            <ion-checkbox (ionChange)="updateCheckedOptions($event, o)" [checked]="keyarray.indexOf(o) >= 0"></ion-checkbox>
          </ion-item>
    </div>
  

    </ion-list>
            <ion-item>
                <ion-label color="primary" stacked>Any other Skills</ion-label>
                <ion-textarea [value]="title" [(ngModel)]="title" name="title" type="text"></ion-textarea>
              </ion-item>
              <br>
          <ion-list style="text-align: center;">
          <button ion-button large (click)="moveNext()">Next</button>
      </ion-list>
</ion-content>`
})
export class CateringKeySkillsPage{
    salary_range: any;
    dateTime: any;
    min: any;
    max: any;
    no_of_heads: any;
    designation: any;
    parent_id: any;
    job_city: any;
    education:any;
    cbarray: any;
   http:any
   rows: any;
   resitems:any;
   service = [];
   bartender = [];
   kitchen = [];
   houseKeep = [];
   frontOffice = [];
   others = [];
   keyarray = [];
   title: any;
   pages: Array<{title: any, img:any}>;
   constructor(public navParams: NavParams,
               public navCtrl: NavController,
               http: Http,
               public network: NetworkServiceProvider,
               public viewCtrl: ViewController,
               public toastCtrl: ToastController,
               public loadingCtrl: LoadingController) {
              this.service = [
              'Continental & Indain Food Knowledge',
              'Good Communication Skills',
              'Should have pleasing personality',
              'Excellent guest service skill',
              'Exceptional knowledge and understanding of food service techniques and standards']
              this.bartender = [
              'Have sound knowledge of spirits, beers, wine, cocktails and coffee',
              'Should have excellent communication skills',
              'Molecular bartending & Flair Bartending',
              'Good personality and Positive interpersonal skills required']
              this.kitchen = [
              'Continental & Indian Food Knowledge',
              'Oriental & Mexican Food Knowledge',
              'South-Indian & Chinese Food Knowledge',
              'Pantry or Bakery Food Knwoledge',
              'Excellent culinary catering talent']
              this.frontOffice = [ 
              'Well developed communication and customer relations skills',
              'Highly organized, results-oriented with the ability to be flexible and work well under pressure',
              'Handles cash, travellers cheque, credit cards and direct billing requests properly',
              'Good guest interaction skills',
              'Takes responsibility in the absence of the Duty Manager  / Front office manager']
              this.houseKeep = [
              'Move, lift, carry, push, pull, and place objects',
              'Moping & Cleaning',
              'Sort linen, stock room attendant closets',
              'Report maintenance issues to Maintenance/Engineering Department',
              'Removes trash collected by room attendants',]
              this.others = [
              'Fluency in English in both written and spoken',
              'Be available 24 hours a day for genuine emergencies within the property',
              'Conduct regular walk through rounds for observing the entire hotel',
              'Oversees and guides the efforts of the Fire and Safety Committee']
              this.salary_range = navParams.get('salary_range')
              this.dateTime =navParams.get('dateTime')
              this.min = navParams.get('min')
              this.max = navParams.get('max')
              this.no_of_heads = navParams.get('no_of_heads')        
              this.designation = navParams.get('designation')
              this.parent_id = navParams.get('parent_id')
              this.job_city = navParams.get('job_city')
              this.education = navParams.get('education')
              this.cbarray = navParams.get('cbarray')              

}

updateCheckedOptions(e: any,data) {
        var list = this.keyarray.indexOf(e)
        if(e.checked){
          this.keyarray.push(data)
        }else{
         var ind = this.keyarray.indexOf(data)
            this.keyarray.splice(ind, 1);
          }
      }
moveNext(){
  if(this.network.noConnection()){
     this.network.showNetworkAlert()
    }else{
        if(this.title != null){
          this.keyarray.push(this.title) 
        }        
        if(this.keyarray.length > 0){
                    this.navCtrl.push(CateringJDPage,{
                          keyarray: this.keyarray,
                          cbarray: this.cbarray,
                          education: this.education,
                          salary_range: this.salary_range,
                          dateTime: this.dateTime,      
                          min: this.min,
                          max: this.max,
                          no_of_heads: this.no_of_heads,
                          designation: this.designation,
                          parent_id: this.parent_id,
                          job_city: this.job_city,
                  },{animate:true,animation:'transition',duration:500,direction:'forward'})
            }else{
              let toast = this.toastCtrl.create({
                  message: 'Please Select a Value',
                  duration: 5000,
                  position: 'bottom',
                });
                toast.present();
          }
  }
 }
}

@Component({
  template: `
  <style>
  textarea.text-input.text-input-md {
    height: 20em;
}
  </style>
<ion-content> 
  <ion-item>
    <ion-label color="primary" stacked style="text-align:center;font-size:20px;font-weight:bold">Job Description</ion-label>
    <ion-textarea style="font-size:14px" type="text" value="{{this.jd}}"></ion-textarea>
  </ion-item>
  <br>
  <ion-list style="text-align: center;">
  <button ion-button large (click)="postJob()">Post Job</button>
  </ion-list>
</ion-content>`
})
export class CateringJDPage{

    salary_range: any;
    dateTime: any;
    min: any;
    max: any;
    no_of_heads: any;
    designation: any;
    parent_id: any;
    job_city: any;
    education:any;
    cbarray: any;
    keyarray: any;

   role:any
   key_skils:any
   http:any
   jd:any
   pages: Array<{title: any, img:any}>;
   resitems: any;
   constructor(public navParams: NavParams,
               public navCtrl: NavController,
               http: Http,
               public network: NetworkServiceProvider,
               public viewCtrl: ViewController, 
               public loadingCtrl: LoadingController,
               public storage: Storage,
               public alertCtrl: AlertController) {
               this.http = http
              this.salary_range = navParams.get('salary_range')
              this.dateTime = navParams.get('dateTime')
              this.min = navParams.get('min')
              this.max = navParams.get('max')
              this.no_of_heads = navParams.get('no_of_heads')        
              this.designation = navParams.get('designation')
              this.parent_id = navParams.get('parent_id')
              this.job_city = navParams.get('job_city')
              this.education = navParams.get('education')
              this.cbarray = navParams.get('cbarray').join()
              this.keyarray = navParams.get('keyarray').join()

            this.jd ='-> We are Looking for '+this.no_of_heads+' '+this.designation+
            '.\n\n -> Experience:- '+this.min+'-'+this.max+
            ' Years. \n\n-> Minimum qualification:- '
            +this.education+'.\n\n-> Role of candidate will be : '+this.cbarray+
            '.\n\n-> The candidate will be given an expected wages of Rs.'+this.salary_range+ 
            ' per day plus service charge & tips.'
}
postJob(){
  if(this.network.noConnection()){
     this.network.showNetworkAlert()
    }else{
          this.storage.get("id").then((id)=>{
          this.storage.get("Hash").then((hash)=>{
          let body = JSON.stringify({
          user_id:id, 
          pname: this.designation,
          min_experience: this.min,
          max_experience: this.max,
          disclose_salary:1,
          no_of_heads: this.no_of_heads,
          salary: this.salary_range, 
          date_of_requirement: this.dateTime,
          education: this.education,
          role: this.cbarray,
          key_skils: this.keyarray,
          job_desc:this.jd,
          job_city:this.job_city
          });
          let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': hash
          });
          let options = new RequestOptions({ headers: headers });
          this.http
              .post('http://www.forehotels.com:3000/api/catering_job', body, options)
              .subscribe(
              data => {
                  let alert = this.alertCtrl.create({
                        title: 'Catering Job Posted Successfully!',
                        buttons: ['OK']
                        });
                        alert.present();
                        this.navCtrl.push(ListPage)
              });
                        let emp_body = JSON.stringify({
                //empty
              })
        this.http.post('http://www.forehotels.com:3000/api/users_list', options, emp_body)
                  .subscribe(data =>{             
                    this.resitems = JSON.parse(data._body).Users;
                  for(let i=0 ;i <this.resitems.length; i++){               
                    let Noti_headers = new Headers({
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic NzE2MWM1N2MtY2U2OC00NDM5LWIwMzktNjM3ZjA2MTYyN2Y0',
                        'Cache-Control': 'no-cache'
                    })
                   let Noti_body = JSON.stringify({
                    device_id: this.resitems[i].device_id,
                    message: 'A new job has been posted at Forehotels',
                    app_id: 'a8874a29-22e2-486f-b4b3-b3d09e8167a5'
                  })
                let Noti_options = new RequestOptions({headers : Noti_headers})
                this.http.post('http://www.forehotels.com:3000/api/single_notification', Noti_body, Noti_options)
                .subscribe(data =>{
              });
              }    
            });
          })
        })
          err => {let alert = this.alertCtrl.create({
                          title: 'Something went wrong!',
                          buttons: ['Retry']
                          });
                          alert.present();
                        }
        }
    }
}