import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DispatchAuthorizationComponent } from './components/container/dispatch-authorization/dispatch-authorization.component';
import { DispatchPlanItemComponent } from './components/container/dispatch-plan-item/dispatch-plan-item.component';
import { DispatchPlanComponent } from './components/container/dispatch-plan/dispatch-plan.component';
import { DispatchTransactionComponent } from './components/container/dispatch-transaction/dispatch-transaction.component';
import { DispatchComponent } from './components/container/dispatch/dispatch.component';
import { GinPrintViewComponent } from './components/container/gin-print-view/gin-print-view.component';
import { RoundPlanCompletionComponent } from './components/container/round-plan-completion/round-plan-completion.component';

const routes: Routes = [
  { path: '', component: DispatchComponent},
  { path: 'dispatch-transactions', component: DispatchTransactionComponent},
  { path: 'dispatch-plan', component: DispatchPlanComponent },
  { path: 'dispatch-authorization', component: DispatchAuthorizationComponent },
  {
    path: 'dispatch-plan/:dispatch_plan_id/items',
    component: DispatchPlanItemComponent
  },
  { path: 'goods-issue-note', component: GinPrintViewComponent },
  { path: 'round-plan-completion', component: RoundPlanCompletionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DispatchRoutingModule { }
