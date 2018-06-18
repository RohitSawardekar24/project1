import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler, NavController } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { DatePipe } from '@angular/common';
import { AboutUsPage } from '../pages/about-us/about-us';

import { PrivacyPolicyPage } from '../pages/privacy-policy/privacy-policy';
import { TermsConditionsPage } from '../pages/terms-conditions/terms-conditions';

import { HelloIonicPage} from '../pages/hello-ionic/hello-ionic';
import { ListPage } from '../pages/list/list';
import { SelectCityPage } from '../pages/select-city/select-city';
import { SelectDesignationPage } from '../pages/select-designation/select-designation';
import { PaymentOptionsPage } from '../pages/payment-options/payment-options';
import { PersonalAssistancePage } from '../pages/personal-assistance/personal-assistance';
import { ScheduleInterviewPage } from '../pages/schedule-interview/schedule-interview';
import { PageGmapAutocomplete} from '../pages/page-gmap-autocomplete/page-gmap-autocomplete';
import { ModalAutocompleteItems } from  '../pages/modal-autocomplete-items/modal-autocomplete-items'; 
import { UpdateProfilePage, UpdatePasswordPage } from '../pages/update-profile/update-profile';
import { EmployeeDetailPage } from '../pages/employee-detail/employee-detail';
import { PostJobPage, ModalPage, EducationAndRolePage, 
         RolePage, 
          KeySkillsPage,
          TipsPage, 
          JDPage, 
          PopoverPageNoOfHeadds,
          PopoverPageMaximum, 
          PopoverPageMinimum, 
          PopoverPageSalary, 
          ExperiencePage} from '../pages/post-job/post-job';
import { CateringRequirementPage,
         CityPage,
         CateringEducationAndRolePage, 
         CateringRolePage, 
          CateringKeySkillsPage,
          CateringJDPage, 
          CateringPopoverPageNoOfHeadds,
          CateringPopoverPageMaximum, 
          CateringPopoverPageMinimum, 
          CateringPopoverPageSalary, 
          CateringExperiencePage
           } from '../pages/catering-requirement/catering-requirement';
import { SearchSupplierPage,FilterCategoryPage } from '../pages/search-supplier/search-supplier';
import { SupplierDetailPage } from '../pages/supplier-detail/supplier-detail';
import { SupplierRequirementPage } from '../pages/supplier-requirement/supplier-requirement';
import { LoginPage } from '../pages/login/login';
import { RegisterPage,ManagerDetailsPage,ModalHotelCategoryPage,ModalHotelDetails,OtpPage } from '../pages/register/register';
import { MyHistoryReportPage, CvDownloadedPage, JobPostedPage, JobsAppliedPage } from '../pages/my-history-report/my-history-report';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password'
import { HomePage } from '../pages/home/home'
import { PackagePage } from '../pages/package/package';
import { ViewPostedJobPage } from '../pages/view-posted-job/view-posted-job';
import { EditJobPage } from '../pages/edit-job/edit-job';
import { EmployeeTabPage, SearchEmployeePage  } from '../pages/employee-tab/employee-tab';
import { ProfilePicPage } from '../pages/profile-pic/profile-pic';
import { CateringTabPage } from '../pages/catering-tab/catering-tab';
import { IntroSPage } from '../pages/intro-s/intro-s';
import { InternTabPage } from '../pages/intern-tab/intern-tab';

import { StatusBar } from '@ionic-native/status-bar';
import { ModalRegisterMapPage } from '../pages/modal-register-map/modal-register-map'
import { SplashScreen } from '@ionic-native/splash-screen';
import { City } from '../providers/city/city';
import { Category } from '../providers/category/category';
import { Designation } from '../providers/designation/designation';
import { IonicStorageModule } from '@ionic/storage';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { FileChooser } from '@ionic-native/file-chooser'
import { Toast } from '@ionic-native/toast';
import { Geolocation } from '@ionic-native/geolocation';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AppVersion } from '@ionic-native/app-version';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { CallNumber } from '@ionic-native/call-number'
import { OneSignal } from '@ionic-native/onesignal';
import { Network } from '@ionic-native/network';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts';
import { Diagnostic } from '@ionic-native/diagnostic'
import { UpgradePackageProvider } from '../providers/upgrade-package/upgrade-package';
import { NetworkServiceProvider } from '../providers/network-service/network-service';
import { HeaderColor } from '@ionic-native/header-color';
import { PaidPersonalAssistancePage } from '../pages/paid-personal-assistance/paid-personal-assistance';
import { ConnectivityServiceProvider } from '../providers/connectivity-service/connectivity-service';
import { GoogleMapsProvider } from '../providers/google-maps/google-maps';
@NgModule({
  declarations: [
  
    MyApp,
    HelloIonicPage,
    AboutUsPage,
      PrivacyPolicyPage,
      TermsConditionsPage,
    RolePage,
    ListPage,
    SelectCityPage,
    SelectDesignationPage,
    PersonalAssistancePage,
    ScheduleInterviewPage,
    PageGmapAutocomplete,
    ModalAutocompleteItems,
    CvDownloadedPage,
    PaymentOptionsPage,
    UpdateProfilePage,
    ProfilePicPage,
    
    ModalRegisterMapPage,
    EmployeeDetailPage,
    KeySkillsPage,
    TipsPage,
    PopoverPageNoOfHeadds,
    SearchEmployeePage,
    PostJobPage,
    OtpPage,
    ManagerDetailsPage,ModalHotelCategoryPage,ModalHotelDetails,
    PopoverPageMaximum, 
          PopoverPageMinimum, 
          PopoverPageSalary, 
          ExperiencePage,
    ModalPage,
    CateringRequirementPage,
    CityPage,
    CateringEducationAndRolePage, 
         CateringRolePage, 
          CateringKeySkillsPage,
          CateringJDPage, 
          CateringPopoverPageNoOfHeadds,
          CateringPopoverPageMaximum, 
          CateringPopoverPageMinimum, 
          CateringPopoverPageSalary, 
          CateringExperiencePage,
    JobPostedPage,
    JobsAppliedPage,
    SearchSupplierPage,
    JDPage,
    FilterCategoryPage,
    SupplierDetailPage,
    SupplierRequirementPage,
    LoginPage,
    RegisterPage,
    HomePage,
    UpdatePasswordPage,
    MyHistoryReportPage,
    EditJobPage,
    ViewPostedJobPage,
    EducationAndRolePage,
    CateringTabPage,
    InternTabPage,
    EmployeeTabPage,
    IntroSPage,
    PackagePage,
    ForgotPasswordPage,
      PaidPersonalAssistancePage
  ],
  imports: [
    BrowserModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp,{
      tabsHideOnSubPages:true
    }),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    ListPage,
    AboutUsPage,
      PrivacyPolicyPage,
      TermsConditionsPage,
    OtpPage,
    SelectCityPage,
    ModalRegisterMapPage,
    CvDownloadedPage,
    UpdatePasswordPage,
    SelectDesignationPage,
    PersonalAssistancePage,
    
    ScheduleInterviewPage,
    PageGmapAutocomplete,
    ModalAutocompleteItems,
    PaymentOptionsPage,
    JobsAppliedPage,
    UpdateProfilePage,
    EmployeeDetailPage,
    SearchEmployeePage,
    PostJobPage,
    ModalPage,
    JobPostedPage,
    CateringRequirementPage,
    CityPage,
    CateringEducationAndRolePage, 
         CateringRolePage, 
          CateringKeySkillsPage,
          CateringJDPage, 
          CateringPopoverPageNoOfHeadds,
          CateringPopoverPageMaximum, 
          CateringPopoverPageMinimum, 
          CateringPopoverPageSalary, 
          CateringExperiencePage,
    KeySkillsPage,
    TipsPage,
    MyHistoryReportPage,
    SearchSupplierPage,
    FilterCategoryPage,
    SupplierDetailPage,
    PopoverPageMaximum, 
          PopoverPageMinimum, 
          PopoverPageSalary, 
          ExperiencePage,
          PopoverPageNoOfHeadds,
    SupplierRequirementPage,
    ProfilePicPage,
    LoginPage,
    PackagePage,
    ManagerDetailsPage,ModalHotelCategoryPage,ModalHotelDetails,
    RolePage,
    RegisterPage,
    HomePage,
    JDPage,
    ViewPostedJobPage,
    EditJobPage,
    CateringTabPage,
    EducationAndRolePage,
    InternTabPage,
    EmployeeTabPage,
    IntroSPage,
    ForgotPasswordPage,
      PaidPersonalAssistancePage
  ],
  providers: [
    Category,
    StatusBar,
    FileTransfer,
    FileChooser,
    FilePath,
    SplashScreen,
    City,
    Designation,
    Toast,
    Geolocation,
    InAppBrowser,
    DatePipe,
    AppVersion,
    Diagnostic,
    GoogleAnalytics,
    OneSignal,
    Network,
    Toast,
    CallNumber,
    Contacts,
    UpgradePackageProvider,
    HeaderColor,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    NetworkServiceProvider,
    ConnectivityServiceProvider,
    GoogleMapsProvider,
    ConnectivityServiceProvider,
      ]
})
export class AppModule {}
