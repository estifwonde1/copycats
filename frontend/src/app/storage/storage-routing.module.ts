import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryAdjustmentComponent } from './components/container/inventory-adjustment/inventory-adjustment.component';
import { StackTransactionComponent } from './components/container/stack-transaction/stack-transaction.component';
import { StackingDetailComponent } from './components/container/stacking-detail/stacking-detail.component';

const routes: Routes = [
  { path: '', component: StackingDetailComponent},
  { path: 'stack-transaction', component: StackTransactionComponent },
  { path: 'inventory-adjustment', component: InventoryAdjustmentComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StorageRoutingModule { }
