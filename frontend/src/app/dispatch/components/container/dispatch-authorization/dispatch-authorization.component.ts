import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { DialogService } from '../../../../shared/services/dialog.service';
import { SessionQuery } from '../../../../auth/state/session.query';
import { DispatchQuery } from '../../../../receipt/state/dispatch/dispatch.query';
import { DispatchService } from '../../../../receipt/state/dispatch/dispatch.sevice';
import { StoreQuery } from '../../../../setup/state/store/store.query';
import { StoreService } from '../../../../setup/state/store/store.sevice';
import { Column } from '../../../../shared/models/column.model';
import { DialogConfig } from '../../../../shared/models/dialog-config.model';
import { DispatchAuthorizationService } from '../../../../dispatch/state/dispatch-authorization/dispatch-authorization.service';
import { DispatchAuthorizationQuery } from '../../../../dispatch/state/dispatch-authorization/dispatch-authorization.query';
import { DispatchAuthorization, EMPTY_DISPATCH_AUTHORIZATION } from '../../../../dispatch/models/dispatch-authorization.model';
import { DispatchAuthorizationFormComponent } from '../../ui/dispatch-authorization-form/dispatch-authorization-form.component';
import { DispatchPlanService } from '../../../../dispatch/state/dispatch-plan/dispatch-plan.sevice';
import { DispatchPlanQuery } from '../../../../dispatch/state/dispatch-plan/dispatch-plan.query';
import { DispatchPlanItemService } from '../../../../dispatch/state/dispatch-plan-item/dispatch-plan-item.sevice';
import { DispatchPlanItemQuery } from '../../../../dispatch/state/dispatch-plan-item/dispatch-plan-item.query';

@Component({
  selector: 'cats-dispatch-authorization',
  templateUrl: './dispatch-authorization.component.html',
  styleUrls: ['./dispatch-authorization.component.scss']
})
export class DispatchAuthorizationComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  actions: any = [];
  dispatchPlans$ = this.dispatchPlanQuery.selectAll();
  dispatchPlanItems$ = this.dispatchPlanItemQuery.selectAll();
  dispatches$ = this.dispatchQuery.selectAll();
  dispatchAuthorizations$ = this.query.selectAll();
  stores$ = this.storeQuery.selectAll();
  selectedDispatch: any;
  selectedDispatchPlan: any;
  selectedDispatchPlanItem: any;
  
  columns: Column[] = [
    { name: 'store_name', label: 'Store' },
    { name: 'quantity', label: 'Quantity' },
    { name: 'unit_abbreviation', label: 'Unit' },
  ];

  tableActions = [
    { icon: 'edit', color: 'warn', tooltip: 'Edit' }
  ];

  dispatchAuthorizationDialog: DialogConfig = {
    title: 'Add Dispatch Authorization',
    formData: '',
    width: '800px',
    formComponent: DispatchAuthorizationFormComponent,
    dialog: this.dialog,
    service: this.service,
    lookupData: '',
    parentComponent: this
  } as DialogConfig;

  constructor(private dialog: MatDialog,
              private dispatchService: DispatchService,
              private dispatchQuery: DispatchQuery,
              private service: DispatchAuthorizationService,
              private query: DispatchAuthorizationQuery,
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
    this.dispatchAuthorizationDialog.formData = {
      ...EMPTY_DISPATCH_AUTHORIZATION,
      dispatch_id: this.selectedDispatch.id,
      authorized_by_id:  this.sessionQuery.userId
    };
    this.dispatchAuthorizationDialog.lookupData = { stores$: this.stores$ };
    DialogService.handleDialog(this.dispatchAuthorizationDialog);
  }

  onDispatchChange(event: any) {
    this.loadDispatchingStores();
    this.actions[0].disabled = false;
  }

  loadDispatchingStores() {
    this.blockUI.start('Loading...');
    this.service.get(this.selectedDispatch.id).subscribe(
      (_:any) => this.blockUI.stop(), () => this.blockUI.stop()
    )
  }

  onDispatchPlanChange(event: any) {
    if(this.sessionQuery.userDetails !== undefined && 'hub' in this.sessionQuery.userDetails) {
      const hub = this.sessionQuery.userDetails['hub'];
      this.blockUI.start('Loading...');
      const criteria = { dispatch_plan_id_eq: event.value.id, source_id_eq: hub };
      this.dispatchPlanItemService.filter(criteria).subscribe(
        (_:any) => this.blockUI.stop(), () => this.blockUI.stop()
      )
    }
  }

  onDispatchPlanItemChange(event: any) {
    this.blockUI.start('Loading...');
    const criteria = { dispatch_plan_item_id_eq: event.value.id, dispatch_status_eq: 'Draft' };
    this.dispatchService.filter(criteria).subscribe(
      (_:any) => this.blockUI.stop(), () => this.blockUI.stop()
    )
  }

  loadDispatchPlans() {
    this.blockUI.start('Loading...');
    let userDetails = this.sessionQuery.userDetails;
    let criteria = { status_eq: 'Approved', upstream_eq: false, dispatch_plan_items_source_id_eq: userDetails['hub']};
    this.dispatchPlanService.filter(criteria).subscribe(
      (_:any) => this.blockUI.stop(), () => this.blockUI.stop()
    );
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

  onEdit(dispatchAuthorization: DispatchAuthorization): void {
    this.dispatchAuthorizationDialog.title = 'Edit Dispatch Authorization';
    this.dispatchAuthorizationDialog.lookupData = {
      stores$: this.stores$
    };
    this.dispatchAuthorizationDialog.formData = dispatchAuthorization;
    DialogService.handleDialog(this.dispatchAuthorizationDialog);
  }

}
