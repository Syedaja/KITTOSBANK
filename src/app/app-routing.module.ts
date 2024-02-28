import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ContentComponent } from './content/content.component';
import { AccountOpenComponent } from './account-open/account-open.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { FixedDepositCalculatorComponent } from './fixed-deposit-calculator/fixed-deposit-calculator.component';
import { AccountComponent } from './account/account.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminloginComponent } from './adminlogin/adminlogin.component';
import { RegisterSuccessfullComponent } from './register-successfull/register-successfull.component';
import { DepositFormComponent } from './deposit-form/deposit-form.component';
import { CheckFormComponentComponent } from './check-form-component/check-form-component.component';




const routes: Routes = [
  {path:"",component:WelcomePageComponent},
  {path:"header",component:HeaderComponent},
  {path:"footer",component:FooterComponent},
  {path:"nav",component:NavbarComponent},
  {path:"content",component:ContentComponent},
  {path:"account_open",component:AccountOpenComponent},
  {path:"dashboard",component:PieChartComponent}, 
  {path:"interest",component:FixedDepositCalculatorComponent},
  {path:"account",component:AccountComponent},
  {path:"login",component:LoginComponent},
  {path:"register",component:RegisterComponent},
  {path:"adminlogin",component:AdminloginComponent},
  {path:"registerSuccess",component:RegisterSuccessfullComponent},
  {path:"demo",component:DepositFormComponent},
  {path:"check",component:CheckFormComponentComponent}


  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
