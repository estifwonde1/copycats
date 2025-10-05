import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DistributionManagementRoutingModule } from './distribution-management-routing.module';
import { DistributionCheckoutComponent }
 from './component/container/distribution-checkout/distribution-checkout.component';
import { SharedModule } from '../shared/shared.module';
import { AppCommonModule } from '../app.common.module';


@NgModule({
  declarations: [
    DistributionCheckoutComponent
  ],
  imports: [
    CommonModule,
    DistributionManagementRoutingModule,
    SharedModule,
    AppCommonModule
  ]
})
export class DistributionManagementModule { }
