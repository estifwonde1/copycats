import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DispatchPlanItemQuery } from '../../../../dispatch/state/dispatch-plan-item/dispatch-plan-item.query';
import { DispatchPlanItemService } from '../../../../dispatch/state/dispatch-plan-item/dispatch-plan-item.sevice';
import { DispatchPlanQuery } from '../../../../dispatch/state/dispatch-plan/dispatch-plan.query';
import { DispatchPlanService } from '../../../../dispatch/state/dispatch-plan/dispatch-plan.sevice';
import { SessionQuery } from '../../../../auth/state/session.query';
import { EMPTY_RECEIPT_AUTHORIZATION, ReceiptAuthorization } from '../../../../receipt/models/receipt-authorization.model';
import { DispatchQuery } from '../../../../receipt/state/dispatch/dispatch.query';
import { DispatchService } from '../../../../receipt/state/dispatch/dispatch.sevice';
import { ReceiptAuthorizationQuery } from '../../../../receipt/state/receipt-authorization/receipt-authorization.query';
import { ReceiptAuthorizationService } from '../../../../receipt/state/receipt-authorization/receipt-authorization.service';
import { StoreQuery } from '../../../../setup/state/store/store.query';
import { StoreService } from '../../../../setup/state/store/store.sevice';
import { Column } from '../../../../shared/models/column.model';
import { DialogConfig } from '../../../../shared/models/dialog-config.model';
import { DialogService } from '../../../../shared/services/dialog.service';
import { ReceiptAuthorizationFormComponent } from '../../ui/receipt-authorization-form/receipt-authorization-form.component';

@Component({
  selector: 'cats-receipt-authorization',
  templateUrl: './receipt-authorization.component.html',
  styleUrls: ['./receipt-authorization.component.scss']
})
export class ReceiptAuthorizationComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  actions: any = [];
  dispatchPlans$ = this.dispatchPlanQuery.selectAll();
  dispatchPlanItems$ = this.dispatchPlanItemQuery.selectAll();
  dispatches$ = this.dispatchQuery.selectAll();
  receiptAuthorizations$ = this.query.selectAll();
  stores$ = this.storeQuery.selectAll();
  selectedDispatch: any;
  selectedDispatchPlan: any;
  selectedDispatchPlanItem: any;
  
  columns: Column[] = [
    { name: 'store_name', label: 'Store' },
    { name: 'quantity', label: 'Quantity' },
    { name: 'unit_abbreviation', label: 'Unit'}
  ];

  tableActions = [
    { icon: 'edit', color: 'warn', tooltip: 'Edit' }
  ];

  receiptAuthorizationDialog: DialogConfig = {
    title: 'Add Receipt Authorization',
    formData: '',
    width: '800px',
    formComponent: ReceiptAuthorizationFormComponent,
    dialog: this.dialog,
    service: this.service,
    lookupData: '',
    parentComponent: this
  } as DialogConfig;

  constructor(private dialog: MatDialog,
              private dispatchService: DispatchService,
              private dispatchQuery: DispatchQuery,
              private service: ReceiptAuthorizationService,
              private query: ReceiptAuthorizationQuery,
              private storeService: StoreService,
              private storeQuery: StoreQuery,
              private dispatchPlanService: DispatchPlanService,
              private dispatchPlanQuery: DispatchPlanQuery,
              private dispatchPlanItemService: DispatchPlanItemService,
              private dispatchPlanItemQuery: DispatchPlanItemQuery,
              private sessionQuery: SessionQuery) { }

  ngOnInit(): void {
    this.actions = [
      { color: 'success', label: 'New', disabled: this.canAdd, icon: 'add_circle' }
    ]
    this.loadHubStores();
    this.loadDispatchPlans();
  }

  canAdd() {
    const result = this.selectedDispatch !== null ? true : false;
    return result;
  }

  onActionClick(event: any) {
    if(event.label === 'New') {
      this.onAddButtonClick();
    }
  }

  onAddButtonClick() {
    this.receiptAuthorizationDialog.formData = {
      ...EMPTY_RECEIPT_AUTHORIZATION,
      dispatch_id: this.selectedDispatch.id,
      authorized_by_id: this.sessionQuery.userId
    };
    this.receiptAuthorizationDialog.lookupData = { stores$: this.stores$ };
    DialogService.handleDialog(this.receiptAuthorizationDialog);
  }

  onDispatchChange(event: any) {
    this.loadReceivingStores();
    this.actions[0].disabled = false;
  }

  onDispatchPlanChange(event: any) {
    if(this.sessionQuery.userDetails !== undefined && 'hub' in this.sessionQuery.userDetails) {
      const hub = this.sessionQuery.userDetails['hub'];
      this.blockUI.start('Loading...');
      const criteria = { dispatch_plan_id_eq: event.value.id, destination_id_eq: hub };
      this.dispatchPlanItemService.filter(criteria).subscribe(
        (_:any) => this.blockUI.stop(), () => this.blockUI.stop()
      )
    }
  }

  onDispatchPlanItemChange(event: any) {
    this.blockUI.start('Loading...');
    const criteria = { dispatch_plan_item_id_eq: event.value.id, dispatch_status_eq: 'Started' };
    this.dispatchService.filter(criteria).subscribe(
      (_:any) => this.blockUI.stop(), () => this.blockUI.stop()
    )
  }

  loadDispatchPlans() {
    this.blockUI.start('Loading...');
    let userDetails = this.sessionQuery.userDetails;
    let criteria: any = { status_eq: 'Approved', upstream_eq: null, dispatch_plan_items_destination_id_eq: userDetails['hub']};
    this.dispatchPlanService.filter(criteria).subscribe(
      (_:any) => this.blockUI.stop(), () => this.blockUI.stop()
    );
  }


  loadReceivingStores() {
    this.blockUI.start('Loading...');
    this.service.get(this.selectedDispatch.id).subscribe(
      (_:any) => this.blockUI.stop(), () => this.blockUI.stop()
    )
  }

  loadHubStores() {
    if(this.sessionQuery.userDetails !== undefined && 'hub' in this.sessionQuery.userDetails) {
      const hub = this.sessionQuery.userDetails['hub'];
      this.blockUI.start('Loading...');
      this.storeService.hubStores(hub).subscribe(
        (_:any) => this.blockUI.stop(), () => this.blockUI.stop()
      );
    }
  }

  loadDispatches() {
    this.blockUI.start('Loading...');
    this.dispatchService.get('Draft').subscribe(
      (_:any) => this.blockUI.stop(), () => this.blockUI.stop()
    );
  }

  onSideButtonClick(event: any): void {
    switch (event.type) {
      case 'edit':
        this.onEdit(event.item);
        break;
      default:
        break;
    }
  }

  onEdit(receiptAuthorization: ReceiptAuthorization): void {
    this.receiptAuthorizationDialog.title = 'Edit Receipt Authorization';
    this.receiptAuthorizationDialog.lookupData = {
      stores$: this.stores$
    };
    this.receiptAuthorizationDialog.formData = receiptAuthorization;
    DialogService.handleDialog(this.receiptAuthorizationDialog);
  }

}
