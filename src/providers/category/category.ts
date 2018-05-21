import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage'
/*
  Generated class for the Category provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Category {
        items: any;
        http:any;
        resitems:any;
        hash:any;
  constructor(http: Http, storage: Storage) {
  this.items = [];
    this.http = http;
    storage.get('Hash').then((hash) => {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': hash
    });
    let options = new RequestOptions({ headers: headers });
      this.http.get("http://localhost:3000/api/supplier_category", options)
            .subscribe(data =>{
            console.log(data);
             this.resitems=data.json();
             for(let i of this.resitems){
             this.items.push({"sc_id": i.sc_id, "sc_name": i.sc_name})
             }
            },error=>{
                console.log(error);// Error getting the data
            } );
    });
  }
     filterItems(searchTerm){
 
        return this.items.filter((item) => {
            return item.sc_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        });     
 
    }
}