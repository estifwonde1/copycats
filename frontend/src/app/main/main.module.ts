import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { LayoutComponent } from './components/container/layout/layout.component';
import { HeaderComponent } from './components/ui/header/header.component';
import { FooterComponent } from './components/ui/footer/footer.component';
import { MenuComponent } from './components/container/menu/menu.component';
import { AppCommonModule } from '../app.common.module';
import { NotificationComponent } from './components/container/notification/notification.component';
import { NotificationMenuComponent } from './components/ui/notification-menu/notification-menu.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    NotificationComponent,
    NotificationMenuComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    AppCommonModule,
    SharedModule
  ]
})
export class MainModule { }
