import { ViewChild, Component } from '@angular/core';
import { NavController, Slides, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-intro-s',
  templateUrl: 'intro-s.html',
})

export class IntroSPage {
 @ViewChild("tourSlide") slider: Slides;
 slides:any;
 isFirstPage = true;
  isLastPage = false;
  currentIndex:any =0;
  constructor(public navCtrl: NavController, public navParams: NavParams) {

   this.slides = [
    {
      title: "Personal Assistance",
      description: "With Personal Assistance you can hire your candidate on your finger tips.",
      image: "assets/img/slide5.jpg",
    },
    {
      title: "Schedule Interview",
      description: "You can schedule an interview with candidates.",
      image: "assets/img/intro2.png",
    },
    {
      title: "Connect with Suppliers",
      description: "You can connect with professional Suppliers who supply goods for a Hotel.",
      image: "assets/img/suppliers.jpg",
    }
    ];
  }
  onSlideChangeStart() {    
    this.currentIndex = this.slider.getActiveIndex();
    console.log("Index"+this.currentIndex)
  }
  moveNext() {
    this.slider.slideNext();
  }
  moveBack() {
    this.slider.slidePrev();
  }
goToHome(){
  this.navCtrl.push(HomePage)
  }
}
