import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage'
@Injectable()
export class Designation {
        items: any;
        http:any;
        resitems:any;
        hash:any;
  constructor(http: Http,storage: Storage) {
    this.items = [];
    this.items.push({"did": 1, "designation": 'Captain'},
                    {"did": 2, "designation": 'Steward'},
                    {"did": 28, "designation": 'Assistant Restaurant Manager (ARM)'},
                    {"did": 64, "designation": 'Commis 1'},
                    {"did": 65, "designation": 'Commis 2'},
                    {"did": 65, "designation": 'Commis 3'},
                    {"did": 32, "designation": 'Bartender'},
                    {"did": 121, "designation": 'Hostess'},
                    {"did": 51, "designation": 'Housekeeping Supervisor'},
    )
    this.http = http;
     storage.get('Hash').then((hash) => {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': hash
    });
    let options = new RequestOptions({ headers: headers });
      this.http.get("http://www.forehotels.com:3000/api/designation", options)
            .subscribe(data =>{
             this.resitems=data.json();
             for(let i of this.resitems){
             this.items.push({"did": i.did, "designation": i.designation})
             }
            },error=>{
                console.log(error);// Error getting the data
            } );
     });   
  }
     filterItems(searchTerm){
 
        return this.items.filter((item) => {
            return item.designation.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        });     
 
    }
}