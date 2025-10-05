import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/container/login/login.component';
import { LoginFormComponent } from './components/ui/login-form/login-form.component';
import { AuthRoutingModule } from './auth-routing.module';
import { AppCommonModule } from '../app.common.module';


@NgModule({
  declarations: [
    LoginComponent,
    LoginFormComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    AppCommonModule
  ]
})
export class AuthModule { }
