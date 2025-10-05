import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DistributionCheckoutComponent }
 from './component/container/distribution-checkout/distribution-checkout.component';

const routes: Routes = [
  { path: '', component: DistributionCheckoutComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DistributionManagementRoutingModule { }
