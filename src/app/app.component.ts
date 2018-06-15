import { Component, ViewChild } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { IonicApp, Platform, MenuController, Nav,AlertController, Events,App } from 'ionic-angular';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { HomePage } from '../pages/home/home';
import { SelectDesignationPage } from '../pages/select-designation/select-designation';
import { UpdateProfilePage } from '../pages/update-profile/update-profile';
import { PersonalAssistancePage } from '../pages/personal-assistance/personal-assistance';
import { ScheduleInterviewPage } from '../pages/schedule-interview/schedule-interview';
import { PostJobPage } from '../pages/post-job/post-job';
import { CateringRequirementPage } from '../pages/catering-requirement/catering-requirement';
import { SearchSupplierPage } from '../pages/search-supplier/search-supplier';
import { IntroSPage } from '../pages/intro-s/intro-s';
import { PackagePage } from '../pages/package/package';
import { SupplierRequirementPage } from '../pages/supplier-requirement/supplier-requirement';
import { ViewPostedJobPage } from '../pages/view-posted-job/view-posted-job';
import { MyHistoryReportPage } from '../pages/my-history-report/my-history-report';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser'
import { OneSignal } from '@ionic-native/onesignal';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Toast } from '@ionic-native/toast';
import { Network } from '@ionic-native/network';
import { AppVersion } from '@ionic-native/app-version';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { EmployeeTabPage } from '../pages/employee-tab/employee-tab';
import { CateringTabPage } from '../pages/catering-tab/catering-tab';
import { InternTabPage } from '../pages/intern-tab/intern-tab';
import { AboutUsPage } from '../pages/about-us/about-us';

import { NetworkServiceProvider } from '../providers/network-service/network-service';
import { UpgradePackageProvider } from '../providers/upgrade-package/upgrade-package';
import { HeaderColor } from '@ionic-native/header-color';
import { TabsPersonalAssistancePage } from '../pages/tabs-personal-assistance/tabs-personal-assistance';
import { PaidPersonalAssistancePage } from '../pages/paid-personal-assistance/paid-personal-assistance';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  key:String = "e36051cb8ca82ee0Lolzippu123456*=";
  loggedIn:boolean;
  http:any;
  items:any;
  colors: string[];
  icons:any
  social_pic:boolean;
  start_time:any;
  rootPage: any;
  city_name:any;
  hotelname:any;
  profilepic:any;
  counter:any;
  no:number;
  app_Id = 'a8874a29-22e2-486f-b4b3-b3d09e8167a5'
  picpath='https://www.forehotels.com/public/assets/img/download1.jpg'
  pages: Array<{title: string, component: any, icon:any, color:any}>;
  constructor(
    http: Http,
    public storage: Storage,
    public platform: Platform,
    public net_work: NetworkServiceProvider,
    private statusbar: StatusBar,
    private splashscreen: SplashScreen,
    public menu: MenuController,
    public upgrade: UpgradePackageProvider,
    public alertCtrl: AlertController,
    public iab: InAppBrowser,     
    public ionicApp: IonicApp,
    private headerColor: HeaderColor,
    public events: Events,
    private appVersion: AppVersion,
    private ga: GoogleAnalytics,
    public toast: Toast,
    public oneSignal: OneSignal,
    public network: Network,
    private contacts : Contacts,
    public app : App,

  ) {
    this.initializeApp();
    this.http = http
  }
  initializeApp() {
    this.events.subscribe('user:updatename',(data)=>{
      this.hotelname=data;
    });
    this.events.subscribe('user:profilepic',(data)=>{
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
   
         this.http.get("http://www.forehotels.com:3000/api/package/"+id, options)
            .subscribe(data =>{
             this.items=JSON.parse(data._body).Jobs; //Bind data to items object
              this.profilepic=this.items["0"].profile_pic;
            });
          });  
        });  
    });
    this.loggedIn = false
    this.social_pic = false
this.colors = ['#1396e2','#f2a900','#69a984','#073855','#00BCD4','#5c6bc0','#ff9800','#26a69a','#ce93d8','#ec407a','#073855'];    
this.icons = ['search','ios-contacts','md-calendar','md-open','ios-create','md-create','md-search','ios-create-outline','ios-eye','ios-document-outline','ios-basket-outline','ios-information-circle-outline'];
    this.pages = [
      { title: 'Search Employee', component: SelectDesignationPage, icon: this.icons[0], color: this.colors[0] },
      { title: 'Personal Assistance', component: TabsPersonalAssistancePage, icon: this.icons[1], color: this.colors[1] },
      { title: 'Schedule Interview', component: ScheduleInterviewPage, icon: this.icons[2], color: this.colors[2] },
      { title: 'Update Profile', component: UpdateProfilePage, icon: this.icons[3], color: this.colors[3] },
      { title: 'Post Job', component: PostJobPage, icon: this.icons[4], color: this.colors[4] },
      { title: 'Post Catering Requirement', component: CateringRequirementPage, icon: this.icons[5], color: this.colors[5] },
      { title: 'Search Supplier', component: SearchSupplierPage, icon: this.icons[6], color: this.colors[6] },
      { title: 'Supplier Requirement', component: SupplierRequirementPage, icon: this.icons[7], color: this.colors[7] },
      { title: 'View Posted Job', component: ViewPostedJobPage, icon: this.icons[8], color: this.colors[8] },
      { title: 'History Report', component: MyHistoryReportPage, icon: this.icons[9] ,color: this.colors[9]},
      { title: 'Packages', component: PackagePage, icon: this.icons[10] ,color: this.colors[10]},
      { title:'About Us', component: AboutUsPage, icon : this.icons[11], color: this.colors[11]},
      ];
    this.no=0;
    this.storage.set("counter",this.no);
    this.storage.set("Hash",this.key);
    this.storage.get('loggedIn').then((id) => {
       if(id == true){
         this.rootPage = ListPage;
         this.storage.get('id').then((id) => {
          this.getDetails(id)
          console.log(id)
        }); 
       }
       else{
         this.rootPage = IntroSPage;
       }
     })
    this.platform.ready().then(() => {
      this.headerColor.tint('#f2a900');
      this.statusbar.backgroundColorByHexString('#1396e2');
      this.splashscreen.hide();
       this.events.subscribe('user:loggedIn', (user) => {
          this.getDetails(user)
          this.menu.enable(true);
  });
     let count= 0;
      this.platform.registerBackButtonAction(() => {
      
          let nav = this.app.getActiveNav(); 
          let loading = this.ionicApp._loadingPortal.getActive();
          let activePortal = this.ionicApp._modalPortal.getActive() ||                            
                             this.ionicApp._overlayPortal.getActive();
          if (activePortal) {
            activePortal.dismiss().catch(() => {});
            activePortal.onDidDismiss(() => {});
            return;
            }
          if(loading){
            loading.dismiss().catch(() => {               
              }); 
            nav.pop();             
          }
          if ( this.menu.isOpen()) {
                this.menu.close();             
              console.log("closing menu");
              return;
          }    
         if(nav.getActive().component === PersonalAssistancePage || nav.getActive().component === PaidPersonalAssistancePage || nav.getActive().component === EmployeeTabPage || nav.getActive().component === CateringTabPage || nav.getActive().component === InternTabPage ){
          this.app.getRootNav().setRoot(ListPage)
        }          
        if(nav.getActive().component === ListPage || nav.getActive().component === HomePage){
            if(count == 0){              
                this.toast.show('Press again to exit Forehotels', '5000', 'bottom').subscribe(
                  toast => {
                    console.log(toast);
                  });
                    setTimeout(() => {
                      count = 0;
                    }, 5000);
              }
              else{
                this.platform.exitApp();
              }
              count++;     
        }else{
          nav.pop();          
          }        
      });
        
            let contact: Contact = this.contacts.create();
          contact.name = new ContactName(null, '- Employee Search', 'Forehotels');
          contact.phoneNumbers = [new ContactField('mobile', '1234567890')];
          contact.save().then(
            () => console.log('Contact saved!', contact),
            (error: any) => console.error('Error saving contact.', error)
          );
          this.statusbar.backgroundColorByHexString('#1396e2');
          this.splashscreen.hide();
          let self = this;
          this.appVersion.getVersionNumber().then(
          data => {
            let app_version = data.split(".")
            console.log(app_version)
            this.storage.get("Hash").then((hash)=>{
            let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': hash
          });
          let options = new RequestOptions({ headers: headers });
          this.http
            .get("http://forehotels.com:3000/api/app_versions", options)
            .subscribe(data =>{
              this.items=JSON.parse(data._body).Apps;
              let app_id = this.items["1"].app_id
              var latest_version = this.items["1"].android_latest_version
              latest_version = latest_version.split(".")
              if(app_id == 2){
                if((app_version[0] != latest_version[0]) || (app_version[1] != latest_version[1]) || (app_version[2] != latest_version[2])){
                  this.updateApp();
                }
              }
             },
            error=>{
                console.log(error);// Error getting the data
              });
            });
          });  
          this.oneSignal.startInit(this.app_Id, '278620255983');
          this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
          this.oneSignal.setSubscription(true);
          this.oneSignal.handleNotificationReceived().subscribe(() => {
          // do something when notification is received
          });

          this.oneSignal.handleNotificationOpened().subscribe(() => {
            this.storage.get('loggedIn').then((result)=>{
                if(result){
                  self.nav.push(ListPage);                
                }else{
                  self.nav.push(HomePage);
                }
            })
          });
          this.oneSignal.endInit();

          this.ga.debugMode()
          this.ga.startTrackerWithId('UA-74078016-8')
          this.ga.enableUncaughtExceptionReporting(true)
          let current_time = new Date().getTime();
          let total_time = (current_time - this.start_time);
          this.ga.trackTiming("Android", total_time, "App Opening Time", "app_open")          
      
    });
    
  }
getDetails(id){
     this.storage.get("Hash").then((value) => {
    let headers = new Headers({
       'Content-Type': 'application/json',
       'Authorization': value
     });
     let options = new RequestOptions({ headers: headers });

      this.http.get("http://forehotels.com:3000/api/package/"+id, options)
         .subscribe(data =>{
          this.items=JSON.parse(data._body).Jobs; //Bind data to items object
          console.log('items ',this.items)
          this.hotelname = this.items[0].name
          this.storage.set("hotelname",this.hotelname)
          this.city_name = this.items[0].city_name
          console.log('cityname ',this.city_name)
          if(this.items[0].profile_pic!= ''){
            var Str = 'https://www.forehotels.com/public/hotel/avatar/'
            this.profilepic = Str+this.items[0].profile_pic
            console.log(this.profilepic)
          }else{
            this.profilepic = this.picpath;
          }
          
          let subscription = this.items["0"].status
          window.localStorage.setItem('status',subscription)
          this.loggedIn = true;
         },error=>{
         this.loggedIn = false;
        } );
     });  
  }
  moveToList(){
    this.menu.close()
    this.nav.setRoot(ListPage)
  }
  openPage(p) {
    if(this.net_work.noConnection()){
           this.net_work.showNetworkAlert()
    }else{
      this.menu.close();
      if(p === PersonalAssistancePage || p === ScheduleInterviewPage || p === MyHistoryReportPage){
            if(localStorage.getItem('status') == 'free'){              
              this.upgrade.upgradepackage()
            }else{
              if(p === ScheduleInterviewPage){
                      if(this.upgrade.interviewAlert()){                        
                        this.upgrade.s_alert()
                      }else{
                        this.upgrade.si_alert()
                      }
                }else{
                  this.nav.push(p);
                }
            }
        }else{
          if(p === PostJobPage || p === CateringRequirementPage){
                if(this.upgrade.checkerPostJob()){
                  this.upgrade.resalert()
                }else{
                  this.upgrade.sucalert()
                }
          }else{
            this.nav.push(p);
          }          
        }
      }
  }
   logout(){
    this.storage.remove('loggedIn').then((status) => {
      this.menu.close();
      this.nav.setRoot(HomePage);
      this.rootPage = HomePage;
      this.menu.enable(false);
    });
  }
  updateApp(){
    let alert = this.alertCtrl.create({
       title: 'Update',
       message: 'Please update your app to enjoy better features',
       buttons: [
         {
           text: 'Cancel',
           role: 'cancel',
           handler: () => {
           }
         },
         {
           text: 'Update',
           handler: () => {
             let browser = this.iab.create('https://play.google.com/store/apps/details?id=com.fore.v100','_system')
             browser.show();
           }
         }
       ]
     });
     alert.present();
  }
}