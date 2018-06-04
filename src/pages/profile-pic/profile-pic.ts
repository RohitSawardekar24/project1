import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { FileChooser } from '@ionic-native/file-chooser'
import { Http, Headers, RequestOptions } from '@angular/http';
import { NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Toast } from '@ionic-native/toast'
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Diagnostic } from '@ionic-native/diagnostic';
import { MyApp } from '../../app/app.component';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
@Component({
  selector: 'page-profile-pic',
  templateUrl: 'profile-pic.html'
})
export class ProfilePicPage {
  profilePicForm:any;
  items:any;
  progress: number;
  completed:boolean;
  http:any;
  id:any;
  hash:any;
  drive_name:any;
  social_pic:any;
  constructor(public transfer: FileTransfer,
              private fp: FilePath ,
              public ga: GoogleAnalytics,
              private fc:FileChooser,
              public network: NetworkServiceProvider,
              private loadingCtrl: LoadingController,
              http: Http, 
              //public myapp: MyApp,
              private storage: Storage, 
              private ngZone: NgZone, 
              private platform: Platform, 
              public navCtrl: NavController, 
              public navParams: NavParams, 
              private alertCtrl: AlertController, 
              private toastCtrl:Toast,
              public diagnostic: Diagnostic) {
           if(this.network.noConnection()){
              this.network.showNetworkAlert()
            }else{
              let loader = this.loadingCtrl.create({
                  spinner: "bubbles",
                  content: "Fetching your Account Details. Kindly wait...",
                });
              
              this.social_pic = false
              loader.present();
              this.storage.get("id").then((id) =>{
                  this.platform.ready().then(() => {
                  this.ga.trackEvent("Update Profile Picture", "Opened", "New Session Started", id, true)
                  this.ga.setAllowIDFACollection(true)
                  this.ga.setUserId(id)
                  this.ga.trackView("Update Profile Picture")
              });
                    this.http = http;
                    var url="http://www.forehotels.com:3000/api/package/"+id;
                    this.getDetails(url, loader);
          });
        }             
  }
  getDetails(x, loader){
    this.storage.get("Hash").then((value)=>{
     let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': value
    });
    let options = new RequestOptions({ headers: headers });
            this.http.get(x, options)
            .subscribe(data =>{
             this.items=JSON.parse(data._body).Jobs;
            let split_name = (this.items["0"].name).split(" ")
              this.drive_name = split_name[0]
             let img = this.items["0"].profile_pic.split("/")
             if(img.length > 1){
               this.social_pic = true;
             }
             loader.dismiss();
            },error=>{
                console.log(error);
            } );
          }) 
   }
  findProfilePic(){
    this.fc.open()
      .then(
        uri => {
          let DrivePicpath = uri.split("/") 
          if(DrivePicpath[0] == 'content:'){
              let fileTransfer: FileTransferObject = this.transfer.create();
                      fileTransfer.download(uri, "file:///storage/emulated/0/Download/" +this.drive_name[0]+'.jpg').then((entry) => {                        
                        let tourl = entry.toURL()
                        this.profilePicUpload(tourl)
                      }, (error) => {
                        // handle error
                      });
          }else{
            this.fp.resolveNativePath(uri)
            .then(filePath => {                 
              this.profilePicUpload(filePath);
            });
        }
      });
  }
  
  profilePicUpload(x){
    if(this.network.noConnection()){
       this.network.showNetworkAlert()
      }else{ 
            this.completed=false;
            var fileArray = x.split("/");
            let len = fileArray.length;
            let file = fileArray[len - 1];
            var filebits = file.split(".");
            var f = filebits[1];

            if((f != "jpg") && (f != "png") && (f != "jpeg")){
              let alert = this.alertCtrl.create({
                    title: "Invalid File Format",
                    subTitle: "Allowed File extensions are JPG, PNG, and JPEG only",
                    buttons: ['Dismiss'],
                  });
                  alert.present();
            }else{
            let fileTransfer: FileTransferObject = this.transfer.create();            
            this.storage.get("id").then((id)=> {
              this.storage.get("Hash").then((hash)=>{
              let options: FileUploadOptions ={
                  fileKey: 'img',
                  fileName: x,
                  mimeType: "multipart/form-data",
                  headers: {
                    authorization : hash
                  },
                  params: {
                    name: file,
                    id: id
                  }
              }
                let onProgress =  (progressEvent: ProgressEvent) : void => {
                  this.ngZone.run(() => {
                      if (progressEvent.lengthComputable) {
                          let progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                          this.progress = progress    
                      }
                  });
              }
                this.completed = false;
                fileTransfer.onProgress(onProgress)
                fileTransfer.upload(x, encodeURI("http://www.forehotels.com:3000/api/upload_hotel_image"), options, true)
                .then((data) => {
                  this.progress=null;
                  this.completed=true;
                  let loader = this.loadingCtrl.create({
                    spinner: "bubbles",
                    content: "Fetching your Account Details. Kindly wait...",
                  });
                  loader.present();
                  let url="http://www.forehotels.com:3000/api/package/"+id;
                  this.getDetails(url, loader);
                  //this.myapp.getDetails(this.id)
                }, (err) => {
                  let alert = this.alertCtrl.create({
                        title: err.text(),
                        subTitle: err.json(),
                        buttons: ['Dismiss'],
                      });
                      alert.present();
              });
            })
          })
        }
      }
  }  
}