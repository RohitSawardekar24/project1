import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Platform, Events } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Http, Headers, RequestOptions } from '@angular/http';
import { NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';
import { ListPage } from '../list/list';
import { File } from '@ionic-native/file';
@Component({
  selector: 'page-profile-pic',
  templateUrl: 'profile-pic.html'
})
export class ProfilePicPage implements OnInit {
ionViewDidEnter(){
     this.loadData()
    }
    ionViewDidLoad(){
      this.loadData()
   }
   ngOnInit(){
     this.loadData();
   }
  profilePicForm:any;
  items:any;
  options:any;
  progress: number;
  completed:boolean;
  http:any;
  id:any;
  hash:any;
  social_pic:any;
  drive_name:any;
  image:any;
  c:number;
  size:any;
  constructor(private loadingCtrl: LoadingController, 
              http: Http, 
              public network: NetworkServiceProvider,
              private file : File,
              private filePath: FilePath,
              private filetransfer: FileTransfer,
              private filechooser: FileChooser,
              private storage: Storage, 
              private ngZone: NgZone, 
              private platform: Platform, 
              public navCtrl: NavController, 
              public navParams: NavParams, 
              private alertCtrl: AlertController, 
              private ga: GoogleAnalytics,
              public events: Events
              ) {           
            this.http = http;    
    }
      loadData(){
      if(this.network.noConnection()){
        this.network.showNetworkAlert()
    }
      else{  
      let loader = this.loadingCtrl.create({
      content: "Fetching your Account Details. Kindly wait...",
    });
        
        this.social_pic = false
        loader.present();
        this.storage.get('user').then((id) =>{
                this.ga.trackEvent("Update Profile Pic Page", "Opened", "", id.id)
                this.ga.trackView("Update Profile Pic")
              });
        this.storage.get('Hash').then((hash) => {
            this.hash = hash;
        });
        this.storage.get('id').then((id) =>{
              
              var url="http://www.forehotels.com:3000/api/package/"+id;
              this.getDetails(url, loader);
              this.id = id;
            });  
          }
      }
  getDetails(x, loader){
     let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.hash
    });
    let options = new RequestOptions({ headers: headers });
            this.http.get(x, options)
            .subscribe(data =>{
             this.items=JSON.parse(data._body).Jobs;
             console.log('profilepic'+this.items["0"].profile_pic);
             let img = this.items[0].profile_pic.split("/")
             this.drive_name = this.items["0"].email.split('@');
             this.drive_name=this.drive_name["0"];
             this.image='https://www.forehotels.com/public/hotel/avatar/'+this.items["0"].profile_pic;
             if(img.length > 1){
               this.social_pic = true;

             }
             loader.dismiss();
            },error=>{
                console.log(error);
            } );
   }
  findProfilePic(){
    this.filechooser.open()
      .then(
        uri => {
          // let alert=this.alertCtrl.create({
          //   title:'uri-->'+uri,
          //   buttons:['OK']
          // });
          // alert.present();
          this.file.resolveLocalFilesystemUrl(uri).then(fileEntry =>{

            fileEntry.getMetadata(function(metadata){
                console.log("size is "+metadata.size);
                this.size = metadata.size;
            }, (err) => {
            });
          });
          let DrivePicpath = uri.split("/") 
          if(DrivePicpath[0] == 'content:'){
              let fileTransfer: FileTransferObject = this.filetransfer.create();
                      fileTransfer.download(uri, "file:///storage/emulated/0/Download/" +this.drive_name+'.jpg').then((entry) => {                        
                        let tourl = entry.toURL()
                        // let alt=this.alertCtrl.create({
                        //   title:'tourl ---->'+tourl,
                        //   buttons:['OK']
                        // });
                        // alt.present();
                        this.profilePicUpload(tourl)
                      }, (error) => {
                        // handle error
                      });
          }else{
            this.filePath.resolveNativePath(uri)
            .then(filePath => {                 
              this.profilePicUpload(filePath);
            });
        }
      });
  }
  
  profilePicUpload(x){
    if(this.network.noConnection()){
        this.network.showNetworkAlert()
    }
      else{
      this.completed=false;
      var fileArray = x.split("/");
      let len = fileArray.length;
      let file = fileArray[len - 1];
      var filebits = file.split(".");
      var f = filebits[1];
      //file=filebits[0]+c+filebits[1];
      if((f != "jpg") && (f != "png") && (f != "jpeg")){
        let alert = this.alertCtrl.create({
              title: "Invalid File Format",
              subTitle: "Allowed File extensions are JPG, JPEG and PNG only",
              buttons: ['Dismiss'],
            });
            alert.present();
      }
      else if(this.size > 2){
        let alert = this.alertCtrl.create({
          title: "File size exceeded",
          subTitle: "File size must not exceed 2mB",
          buttons: ['Dismiss'],
        });
        alert.present();
      }
      else{
        this.storage.get("counter").then((count)=>{this.c=count;
        // file=filebits[0]+this.c+'.'+filebits[1];
        file='hotel_'+this.id+this.c+'.'+filebits[1];
        // let alert=this.alertCtrl.create({
        //   title:file+'is the file name to be stored in db',
        //   buttons:['OK']
        // })
        // alert.present();
      
        // let alt = this.alertCtrl.create({
        //   title: "file name===>"+file,
        //   buttons: ['Dismiss'],
        // });
        // alt.present();
        let fileTransfer: FileTransferObject = this.filetransfer.create();
      this.options = {
        fileKey: 'img',
        fileName: file,
        mimeType: "multipart/form-data",
        headers: {
          authorization : 'e36051cb8ca82ee0Lolzippu123456*='
        },
        params: {
          name: file,
          id: this.id
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
      fileTransfer.upload(x, encodeURI("http://www.forehotels.com:3000/api/upload_hotel_image"), this.options, true)
      .then((data) => {
        this.progress=null;
        this.completed=true;
        let loader = this.loadingCtrl.create({
          content: "Fetching your Account Details. Kindly wait...",
        });
        loader.present();
        let headers = new Headers({
          'Content-Type': 'application/json',
          'Authorization': this.hash
        });
        let options = new RequestOptions({ headers: headers });
        let url="http://www.forehotels.com:3000/api/package/"+this.id;
        this.http.get(url, options)
            .subscribe(data =>{
             this.items=JSON.parse(data._body).Jobs;
             let img = this.items[0].profile_pic.split("/")
             this.drive_name = this.items["0"].email.split('@');
             this.drive_name=this.drive_name["0"];
             if(img.length > 1){
              this.image='https://www.forehotels.com/public/hotel/avatar/'+this.items["0"].profile_pic
               this.social_pic = true;
               let alert=this.alertCtrl.create({
                title:'Profile pic uploaded',
                buttons:['OK']
              })
              alert.present();
             }
             loader.dismiss();
            },error=>{
                console.log(error);
            } 
            );
      }, (err) => {
        let alert = this.alertCtrl.create({
              title: err.text(),
              subTitle: err.json(),
              buttons: ['Dismiss'],
            });
            alert.present();
      });
      this.c+=1;
      this.storage.set("counter",this.c).then(()=>
      {
        // let a=this.alertCtrl.create({
        // title:'Storage updated to'+this.c,
        // buttons:['OK']});
        // a.present();
        this.events.publish('user:profilepic','doone');
        this.navCtrl.push(ListPage);
      });
    });
    
        
     
      }
    }
  }
}