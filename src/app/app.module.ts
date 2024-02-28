import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ContentComponent } from './content/content.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccountOpenComponent } from './account-open/account-open.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { FixedDepositCalculatorComponent } from './fixed-deposit-calculator/fixed-deposit-calculator.component';
import { HttpClientModule } from '@angular/common/http';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { AccountComponent } from './account/account.component';
import { LoginComponent } from './login/login.component';
import { RouterModule} from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchPipe } from './search.pipe';
import { AdminloginComponent } from './adminlogin/adminlogin.component';
import { BnNgIdleModule } from 'bn-ng-idle';
import { BankserviceService } from './bankservice.service';
import { RegisterSuccessfullComponent } from './register-successfull/register-successfull.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { AsteriskMaskPipe } from './asterisk-mask.pipe';
import { SerchAccountsPipe } from './serch-accounts.pipe';
import { DepositFormComponent } from './deposit-form/deposit-form.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MyModalComponent } from './my-modal/my-modal.component';
import { CarouselComponent } from './carousel/carousel.component';
import { CheckFormComponentComponent } from './check-form-component/check-form-component.component';













@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NavbarComponent,
    ContentComponent,
    AccountOpenComponent,
    WelcomePageComponent,
    FixedDepositCalculatorComponent,
    PieChartComponent,
    AccountComponent,
    LoginComponent,
    RegisterComponent,
    SearchPipe,
    AdminloginComponent,
    RegisterSuccessfullComponent,
    SpinnerComponent,
    AsteriskMaskPipe,
    SerchAccountsPipe,
    DepositFormComponent,
    MyModalComponent,
    CarouselComponent,
    CheckFormComponentComponent,
 
    
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),

    

  ],
  providers: [BnNgIdleModule,],
  bootstrap: [AppComponent]
})
export class AppModule { }
