import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PersonalAssistancePage } from '../personal-assistance/personal-assistance';
import { PaidPersonalAssistancePage } from '../paid-personal-assistance/paid-personal-assistance';


@Component({
  selector: 'page-tabs-personal-assistance',
  templateUrl: 'tabs-personal-assistance.html',
})
export class TabsPersonalAssistancePage {
  tab1Root = PersonalAssistancePage;
  tab2Root = PaidPersonalAssistancePage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPersonalAssistancePage');
  }

}
