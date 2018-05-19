import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';
import { NetworkServiceProvider } from '../../providers/network-service/network-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  constructor(public network: NetworkServiceProvider,public navCtrl: NavController, public menu: MenuController) {
    this.menu.enable(false)
  }
goToLogin(){
  this.navCtrl.push(LoginPage);
}
goToVerify(){
      this.navCtrl.push(RegisterPage)        
  }
}
