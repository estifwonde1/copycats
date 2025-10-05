import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DispatchRoutingModule } from './dispatch-routing.module';
import { DispatchComponent } from './components/container/dispatch/dispatch.component';
import { DispatchFormComponent } from './components/ui/dispatch-form/dispatch-form.component';
import { AppCommonModule } from '../app.common.module';
import { SharedModule } from '../shared/shared.module';
import { DispatchPlanComponent } from './components/container/dispatch-plan/dispatch-plan.component';
import { DispatchPlanFormComponent } from './components/ui/dispatch-plan-form/dispatch-plan-form.component';
import { DispatchPlanItemComponent } from './components/container/dispatch-plan-item/dispatch-plan-item.component';
import { DispatchPlanItemFormComponent } from './components/ui/dispatch-plan-item-form/dispatch-plan-item-form.component';
import { DispatchTransactionComponent } from './components/container/dispatch-transaction/dispatch-transaction.component';
import { DispatchTransactionFormComponent } from './components/ui/dispatch-transaction-form/dispatch-transaction-form.component';
import { DispatchAuthorizationComponent } from './components/container/dispatch-authorization/dispatch-authorization.component';
import { DispatchAuthorizationFormComponent } from './components/ui/dispatch-authorization-form/dispatch-authorization-form.component';
import { GeneratedDispatchPlanItemsComponent } from './components/ui/generated-dispatch-plan-items/generated-dispatch-plan-items.component';
import { GinFormComponent } from './components/ui/gin-form/gin-form.component';
import { AuthorizationFormComponent } from './components/ui/authorization-form/authorization-form.component';
import { GinPrintViewComponent } from './components/container/gin-print-view/gin-print-view.component';
import { ReceiptAuthorizationFormComponent } from './components/ui/receipt-authorization-form/receipt-authorization-form.component';
import { RoundPlanCompletionComponent } from './components/container/round-plan-completion/round-plan-completion.component';

@NgModule({
  declarations: [
    DispatchComponent,
    DispatchFormComponent,
    DispatchPlanComponent,
    DispatchPlanFormComponent,
    DispatchPlanItemComponent,
    DispatchPlanItemFormComponent,
    DispatchTransactionComponent,
    DispatchTransactionFormComponent,
    DispatchAuthorizationComponent,
    DispatchAuthorizationFormComponent,
    GeneratedDispatchPlanItemsComponent,
    GinFormComponent,
    AuthorizationFormComponent,
    GinPrintViewComponent,
    ReceiptAuthorizationFormComponent,
    RoundPlanCompletionComponent
  ],
  imports: [
    CommonModule,
    DispatchRoutingModule,
    SharedModule,
    AppCommonModule
  ]
})
export class DispatchModule { }
