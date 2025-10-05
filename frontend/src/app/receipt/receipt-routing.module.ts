import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HubAuthorizationComponent } from './components/container/hub-authorization/hub-authorization.component';
import { ReceiptComponent } from './components/container/receipt/receipt.component';
import { ReceiptAuthorizationComponent } from './components/container/receipt-authorization/receipt-authorization.component';
import { GrnPrintViewComponent } from './components/container/grn-print-view/grn-print-view.component';

const routes: Routes = [
  { path: '', component: ReceiptComponent},
  { path: 'hub-authorization', component: HubAuthorizationComponent },
  { path: 'receipt-authorization', component: ReceiptAuthorizationComponent },
  { path: 'goods-receipt-note', component: GrnPrintViewComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceiptRoutingModule { }
