import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StorageRoutingModule } from './storage-routing.module';
import { StackingDetailComponent } from './components/container/stacking-detail/stacking-detail.component';
import { StackingDetailFormComponent } from './components/ui/stacking-detail-form/stacking-detail-form.component';
import { MaterialModule } from '../app.material.module';
import { NgPrimeModule } from '../app.ngprime.module';
import { AppCommonModule } from '../app.common.module';
import { SharedModule } from '../shared/shared.module';
import { StackTransactionComponent } from './components/container/stack-transaction/stack-transaction.component';
import { StackTransactionFormComponent } from './components/ui/stack-transaction-form/stack-transaction-form.component';
import { InventoryAdjustmentComponent } from './components/container/inventory-adjustment/inventory-adjustment.component';
import { InventoryAdjustmentFormComponent } from './components/ui/inventory-adjustment-form/inventory-adjustment-form.component';


@NgModule({
  declarations: [
    StackingDetailComponent,
    StackingDetailFormComponent,
    StackTransactionComponent,
    StackTransactionFormComponent,
    InventoryAdjustmentComponent,
    InventoryAdjustmentFormComponent
  ],
  imports: [
    CommonModule,
    StorageRoutingModule,
    MaterialModule,
    NgPrimeModule,
    AppCommonModule,
    SharedModule
  ]
})
export class StorageModule { }
