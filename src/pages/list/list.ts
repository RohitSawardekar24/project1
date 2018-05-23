import { Component,ViewChild } from '@angular/core';
import { Slides,Platform, App, ToastController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { NavController, NavParams, MenuController } from 'ionic-angular'; 
import { HomePage } from '../home/home'; 
import { SelectDesignationPage } from '../select-designation/select-designation';
import { UpdateProfilePage } from '../update-profile/update-profile';
import { PersonalAssistancePage } from '../personal-assistance/personal-assistance';
import { ScheduleInterviewPage } from '../schedule-interview/schedule-interview';
import { PostJobPage } from '../post-job/post-job';
import { PackagePage } from '../package/package';
import { MyHistoryReportPage } from '../my-history-report/my-history-report';
import { CateringRequirementPage } from '../catering-requirement/catering-requirement';
import { SearchSupplierPage } from '../search-supplier/search-supplier';

import { SupplierRequirementPage } from '../supplier-requirement/supplier-requirement';
import { ViewPostedJobPage } from '../view-posted-job/view-posted-job';
import { Toast } from '@ionic-native/toast'
import { Storage } from '@ionic/storage';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { UpgradePackageProvider } from '../../providers/upgrade-package/upgrade-package';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { TabsPersonalAssistancePage } from '../tabs-personal-assistance/tabs-personal-assistance';

@Component({  
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  @ViewChild(Slides) slides: Slides;
  icons: string[];
  loggedIn:boolean;
  http:any;
  items:any;
  social_pic:boolean;
  colors: string[];
  rootPage:any
  images: Array<string>;  
  rows: any;
  pages: Array<{title: string, img:any, component:any}>;

  constructor(public app: App,
              public toast: Toast,
              public platform: Platform,
              http: Http,
              public storage: Storage,
              public ga: GoogleAnalytics,
              public toastCtrl: ToastController,
              public upgrade:UpgradePackageProvider,
              public navParams: NavParams,
              public network: NetworkServiceProvider, 
              public navCtrl: NavController,
              public menu: MenuController) {
     this.images = ['assets/img/personal_assistance.png','assets/img/schedule_interview.png','assets/img/update_profile.png','assets/img/post_job.png','assets/img/catering_requirement.png','assets/img/search_supplier.png','assets/img/post_supplier_requirement.png','assets/img/view_posted_job.png','assets/img/history_report.png']
     this.rows = Array.from(Array(Math.ceil(9/3)).keys());
     this.http = http
     this.storage.get("id").then((id) => {
     this.storage.get("Hash").then((value) => {
        this.platform.ready().then(() => {
          this.ga.trackEvent("Dashboard", "Opened", "New Session Started", id, true)
          this.ga.setAllowIDFACollection(true)
          this.ga.setUserId(id)
          this.ga.trackView("Dashboard")
        });
        let headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': value
        });
     let options = new RequestOptions({ headers: headers });

      this.http.get("http://localhost:3000/api/package/"+id, options)
         .subscribe(data =>{
          this.items=JSON.parse(data._body).Jobs; //Bind data to items object
         });
       });  
     });  
    this.pages = [
      { title: 'Personal Assistance', img: this.images[0], component: TabsPersonalAssistancePage },
      { title: 'Schedule Interview', img: this.images[1], component: ScheduleInterviewPage },
      { title: 'Update Profile', img: this.images[2], component:UpdateProfilePage },
      { title: 'Post Job', img: this.images[3], component:PostJobPage },
      { title: 'Post Catering Requirement', img: this.images[4], component:CateringRequirementPage},
      { title: 'Search Supplier', img: this.images[5], component:SearchSupplierPage },
      { title: 'Supplier Requirement', img: this.images[6], component:SupplierRequirementPage},
      { title: 'View Posted Job', img: this.images[7], component:ViewPostedJobPage },
      { title: 'History Report', img: this.images[8], component:MyHistoryReportPage },
  ];
}

menuOpen(){
  this.menu.open()
}
  openPage(p){
    if(this.network.noConnection()){
           this.network.showNetworkAlert()
      }else{
        if(p.component === PersonalAssistancePage || p.component === ScheduleInterviewPage || p.component === MyHistoryReportPage){
              if(localStorage.getItem('status') == 'free'){
                this.upgrade.upgradepackage()
              }else{
                if(p.component === ScheduleInterviewPage){
                      if(this.upgrade.interviewAlert()){
                        this.upgrade.s_alert()
                      }else{
                        this.upgrade.si_alert()
                      }
                }else{
                this.navCtrl.push(p.component,{},{animate:true,animation:'transition',duration:500,direction:'forward'})
              }
            }
          }else if(p.component === PostJobPage || p.component === CateringRequirementPage){
                if(this.upgrade.checkerPostJob()){
                  this.upgrade.resalert()
                }else{
                  this.upgrade.sucalert()
                }
          }else{
            this.navCtrl.push(p.component,{},{animate:true,animation:'transition',duration:500,direction:'forward'})                            
            
          }          
        }
    }
  
  SearchEmployee(){
    if(this.network.noConnection()){
       this.network.showNetworkAlert()
    }else{
       this.navCtrl.push(SelectDesignationPage)
    }
  }
  purchasePackage(){
    if(this.network.noConnection()){
       this.network.showNetworkAlert()
      }else{
       this.navCtrl.push(PackagePage)
    }
  }
}