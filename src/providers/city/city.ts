import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage'
@Injectable()
export class City {
        items: any;
        http:any;
        resitems:any;
        hash:any;
  constructor(http: Http, storage: Storage) {
    this.items = [];
    this.items.push({"c_id": 1, "city_name": 'Mumbai'},
                    {"c_id": 2, "city_name": 'Nagpur'},
                    {"c_id": 3, "city_name": 'Pune'})
    this.http = http;
     storage.get('Hash').then((hash) => {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': hash
    });
    let options = new RequestOptions({ headers: headers });
      this.http.get("http://localhost:3000/api/city", options)
            .subscribe(data =>{
            this.items = [];
             this.resitems = data.json();
             for(let i of this.resitems){
             this.items.push({"c_id": i.c_id, "city_name": i.city_name})
             }
            },error=>{
                console.log(error);// Error getting the data
            } );
     });  
  }
        filterItems(searchTerm){
 
        return this.items.filter((item) => {
            return item.city_name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        });     
 
    }
}
