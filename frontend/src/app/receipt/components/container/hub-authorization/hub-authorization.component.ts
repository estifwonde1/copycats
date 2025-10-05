import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SessionQuery } from '../../../../auth/state/session.query';
import { EMPTY_HUB_AUTHORIZATION, HubAuthorization } from '../../../../receipt/models/hub-authorization.model';
import { AllocationItemQuery } from '../../../../receipt/state/allocation-item/allocation-item.query';
import { AllocationItemService } from '../../../../receipt/state/allocation-item/allocation-item.sevice';
import { HubAuthorizationQuery } from '../../../../receipt/state/hub-authorization/hub-authorization.query';
import { HubAuthorizationService } from '../../../../receipt/state/hub-authorization/hub-authorization.service';
import { StoreQuery } from '../../../../setup/state/store/store.query';
import { StoreService } from '../../../../setup/state/store/store.sevice';
import { Column } from '../../../../shared/models/column.model';
import { DialogConfig } from '../../../../shared/models/dialog-config.model';
import { DialogService } from '../../../../shared/services/dialog.service';
import { HubAuthorizationFormComponent } from '../../ui/hub-authorization-form/hub-authorization-form.component';

@Component({
  selector: 'cats-hub-authorization',
  templateUrl: './hub-authorization.component.html',
  styleUrls: ['./hub-authorization.component.scss']
})
export class HubAuthorizationComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  actions: any = [];
  authorizationTypes: any[] = [
    { name: 'Source', value: 'source' },
    { name: 'Destination', value: 'destination' }
  ]
  allocationItems$ = this.allocationItemQuery.selectAll();
  hubAuthorizations$ = this.query.selectAll();
  stores$ = this.storeQuery.selectAll();
  selectedAllocationItem: any;
  selectedAuthorizationType: any;

  columns: Column[] = [
    { name: 'store_name', label: 'Store' },
    { name: 'quantity', label: 'Quantity' },
    { name: 'unit_abbreviation', label: 'Unit' },
  ];

  tableActions = [
    { icon: 'edit', color: 'warn', tooltip: 'Edit' }
  ];

  hubAuthorizationDialog: DialogConfig = {
    title: 'Add Hub Authorization',
    formData: '',
    width: '800px',
    formComponent: HubAuthorizationFormComponent,
    dialog: this.dialog,
    service: this.service,
    lookupData: '',
    parentComponent: this
  } as DialogConfig;

  constructor(private dialog: MatDialog,
              private allocationItemService: AllocationItemService,
              private allocationItemQuery: AllocationItemQuery,
              private service: HubAuthorizationService,
              private query: HubAuthorizationQuery,
              private storeService: StoreService,
              private storeQuery: StoreQuery,
              private sessionQuery: SessionQuery) { }

  ngOnInit(): void {
    this.actions = [
      { color: 'success', label: 'New', disabled: this.canAdd, icon: 'add_circle' }
    ]
    this.loadHubStores();
  }

  canAdd() {
    const result = this.selectedAllocationItem !== null ? true : false;
    return result;
  }

  onActionClick(event: any) {
    if(event.label === 'New') {
      this.onAddButtonClick();
    }
  }

  onAddButtonClick() {
    this.hubAuthorizationDialog.formData = {
        ...EMPTY_HUB_AUTHORIZATION,
        dispatch_plan_item_id: this.selectedAllocationItem.id,
        authorized_by_id: this.sessionQuery.userId,
        authorization_type: this.selectedAuthorizationType.name
      };
    this.hubAuthorizationDialog.lookupData = { stores$: this.stores$ };
    DialogService.handleDialog(this.hubAuthorizationDialog);
  }

  onAllocationItemChange(event: any) {
    this.loadHubAuthorizations();
    this.actions[0].disabled = false;
  }

  loadHubAuthorizations() {
    this.blockUI.start('Loading...');
    const criteria = { dispatch_plan_item_id_eq: this.selectedAllocationItem.id,
                       authorization_type_eq: this.selectedAuthorizationType.name }
    this.service.filter(criteria).subscribe(
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

  onAuthorizeButtonClick() {
    let newStatus = '';
    if(this.selectedAllocationItem.status === 'Unauthorized' && this.selectedAuthorizationType.value === 'source') {
      newStatus = 'Source Authorized';
    } else if(this.selectedAllocationItem.status === 'Unauthorized' && this.selectedAuthorizationType.value === 'destination') {
      newStatus = 'Destination Authorized';
    } else {
      newStatus = 'Authorized';
    }
    this.blockUI.start('Authorizing...');
    this.allocationItemService.authorize(this.selectedAllocationItem.id, { status: newStatus} ).subscribe(
      (_:any) => this.blockUI.stop(), () => this.blockUI.stop()
    )
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

  onEdit(hubAuthorization: HubAuthorization): void {
    this.hubAuthorizationDialog.title = 'Edit Authorization';
    this.hubAuthorizationDialog.lookupData = {
      stores$: this.stores$
    };
    this.hubAuthorizationDialog.formData = hubAuthorization;
    DialogService.handleDialog(this.hubAuthorizationDialog);
  }

  onAuthorizationTypeChange(event: any) {
    this.selectedAllocationItem = null;
    this.actions[0].disabled = true;
    this.service.reset();
    this.blockUI.start('Loading...');
    let hubs = [];
    if(this.sessionQuery.userDetails !== undefined && 'hub' in this.sessionQuery.userDetails) {
      hubs = this.sessionQuery.userDetails['hub'];
    }
    let criteria: any = {};
    if(this.selectedAuthorizationType.value === 'source') {
      criteria['source_id_in'] = [hubs];
      criteria['status_in'] = ['Unauthorized', 'Destination Authorized'];
    } else {
      criteria['destination_id_in'] = [hubs];
      criteria['status_in'] = ['Unauthorized', 'Source Authorized'];
    }
    this.allocationItemService.filter(criteria).subscribe(
      (_:any) => this.blockUI.stop(), () => this.blockUI.stop()
    )
  }

}
