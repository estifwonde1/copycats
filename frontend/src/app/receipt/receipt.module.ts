import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReceiptRoutingModule } from './receipt-routing.module';
import { ReceiptComponent } from './components/container/receipt/receipt.component';
import { SharedModule } from '../shared/shared.module';
import { AppCommonModule } from '../app.common.module';
import { ReceiptFormComponent } from './components/ui/receipt-form/receipt-form.component';
import { LostCommodityFormComponent } from './components/ui/lost-commodity-form/lost-commodity-form.component';
import { HubAuthorizationComponent } from './components/container/hub-authorization/hub-authorization.component';
import { HubAuthorizationFormComponent } from './components/ui/hub-authorization-form/hub-authorization-form.component';
import { ReceiptAuthorizationComponent } from './components/container/receipt-authorization/receipt-authorization.component';
import { ReceiptAuthorizationFormComponent } from './components/ui/receipt-authorization-form/receipt-authorization-form.component';
import { GrnFormComponent } from './components/ui/grn-form/grn-form.component';
import { GrnPrintViewComponent } from './components/container/grn-print-view/grn-print-view.component';

@NgModule({
  declarations: [
    ReceiptComponent,
    ReceiptFormComponent,
    LostCommodityFormComponent,
    HubAuthorizationComponent,
    HubAuthorizationFormComponent,
    ReceiptAuthorizationComponent,
    ReceiptAuthorizationFormComponent,
    GrnFormComponent,
    GrnPrintViewComponent
  ],
  imports: [
    CommonModule,
    ReceiptRoutingModule,
    SharedModule,
    AppCommonModule
  ]
})
export class ReceiptModule { }
