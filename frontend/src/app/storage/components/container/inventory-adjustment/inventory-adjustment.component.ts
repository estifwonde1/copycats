import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { LocationService } from '../../../../setup/state/location/location.sevice';
import { Stack } from '../../../../floor-plan/models/stack.model';
import { LocationQuery } from '../../../../setup/state/location/location.query';
import { StoreService } from '../../../../setup/state/store/store.sevice';
import { StoreQuery } from '../../../../setup/state/store/store.query';
import { StackService } from '../../../../floor-plan/state/stack/stack.sevice';
import { StackQuery } from '../../../../floor-plan/state/stack/stack.query';
import { InventoryAdjustmentService } from '../../../../storage/state/inventory-adjustment/inventory-adjustment.service';
import { InventoryAdjustmentQuery } from '../../../../storage/state/inventory-adjustment/inventory-adjustment.query';
import { EMPTY_INVENTORY_ADJUSTMENT, InventoryAdjustment } from '../../../../storage/models/inventory-adjustment.model';
import { DialogConfig } from '../../../../shared/models/dialog-config.model';
import { InventoryAdjustmentFormComponent } from '../../ui/inventory-adjustment-form/inventory-adjustment-form.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from '../../../../shared/services/dialog.service';
import { Column } from '../../../../shared/models/column.model';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { UnitOfMeasureService } from '../../../../dispatch/state/unit-of-measure/unit-of-measure.service';
import { UnitOfMeasureQuery } from '../../../../dispatch/state/unit-of-measure/unit-of-measure.query';

@Component({
  selector: 'cats-inventory-adjustment',
  templateUrl: './inventory-adjustment.component.html',
  styleUrls: ['./inventory-adjustment.component.scss']
})
export class InventoryAdjustmentComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  actions: any = [];
  hubs: any[] = [];
  warehouses: any[] = [];
  stores$: Observable<any[]> = this.storeQuery.selectAll();
  stacks$: Observable<Stack[]> = this.stackQuery.selectAll();
  inventoryAdjustments$: Observable<InventoryAdjustment[]> = this.query.selectAll();
  unitOfMeasures$: Observable<any[]> = this.uomQuery.selectAll();
  selectedHub: any;
  selectedWarehouse: any;
  selectedStore: any;
  selectedStack: any;

  columns: Column[] = [
    { name: 'reference_no', label: 'Reference Number' },
    { name: 'stack_name', label: 'Stack' },
    { name: 'quantity', label: 'Quantity', },
    { name: 'unit', label: 'Unit', },
    { name: 'reason_for_adjustment', label: 'Reason for Adjustment', },
  ];

  tableActions = [
    { icon: 'edit', color: 'warn', tooltip: 'Edit', disable: this.cannotEdit },
    { icon: 'assignment_turned_in', color: 'warn', tooltip: 'Commit' },
  ];

  inventoryAdjustmentDialog: DialogConfig = {
    title: 'Inventory Adjustment',
    formData: '',
    width: '800px',
    formComponent: InventoryAdjustmentFormComponent,
    dialog: this.dialog,
    service: this.service,
    lookupData: '',
    parentComponent: this
  } as DialogConfig;

  constructor(private dialog: MatDialog,
              private service: InventoryAdjustmentService,
              private query: InventoryAdjustmentQuery,
              private locationService: LocationService,
              private locationQuery: LocationQuery,
              private storeService: StoreService,
              private storeQuery: StoreQuery,
              private stackService: StackService,
              private stackQuery: StackQuery,
              private uomService: UnitOfMeasureService,
              private uomQuery: UnitOfMeasureQuery) { }


  cannotEdit({icon}: any, {status}: any): boolean {
    return icon === 'edit' && status === 'Committed'
  }

  ngOnInit(): void {
    this.actions = [
      { color: 'success', label: 'New', disabled: true, icon: 'add_circle' }
    ];

    this.loadHubs();
    this.loadUnitOfMeasures();
  }

  loadHubs() {
    const criteria = { location_type_eq: 'Hub' };
    this.blockUI.start('Loading....');
    this.locationService.filter(criteria).subscribe(
      (result: any) => {
        this.hubs = result.data;
        this.blockUI.stop();
      },
      () => this.blockUI.stop()
    );
  }

  loadUnitOfMeasures() {
    this.blockUI.start('Loading...');
    this.uomService.get().subscribe(
      (_:any) => this.blockUI.stop(),
      () => this.blockUI.stop()
    )
  }

  onHubChange() {
    this.blockUI.start('Loading...');
    this.locationService.get('Hub', this.selectedHub.id).subscribe(
      (result: any) => {
        this.warehouses = result.data;
        this.blockUI.stop();
      },
      () => this.blockUI.stop()
    )
  }

  onWarehouseChange() {
    this.blockUI.start('Loading...');
    this.storeService.get(this.selectedWarehouse.id).subscribe(
      (_:any) => this.blockUI.stop(),
      () => this.blockUI.stop()
    )
  }

  onStoreChange() {
    this.blockUI.start('Loading...');
    this.stackService.get(this.selectedStore.id).subscribe(
      (_:any) => {
        this.blockUI.stop()
      },
      () => this.blockUI.stop()
    );
  }

  onStackChange() {
    this.blockUI.start('Loading...');
    const criteria = { stack_id_eq: this.selectedStack.id };
    this.service.filter(criteria).subscribe(
      (_:any) => {
        this.actions[0].disabled = false;
        this.blockUI.stop()
      },
      () => this.blockUI.stop()
    );
  }
  

  onToolbarActionClick(event: any) {
    switch(event.label) {
      case 'New':
        this.onAddButtonClick();
        break;
      default:
        break;
    }
  }

  onAddButtonClick() {
    this.inventoryAdjustmentDialog.formData = { 
      ...EMPTY_INVENTORY_ADJUSTMENT, 
      hub_id: this.selectedStore.id,
      warehouse_id: this.selectedWarehouse.id,
      store_id: this.selectedStore.id
    };
    this.inventoryAdjustmentDialog.lookupData = { 
      stacks$: this.stackQuery.selectAll(),
      unitOfMeasures$: this.uomQuery.selectAll()
    };
    DialogService.handleDialog(this.inventoryAdjustmentDialog);
  }

  onTableActionClick(event: any) {
    switch (event.type) {
      case 'edit':
        this.onEdit(event.item);
        break;
      case 'assignment_turned_in':
        this.onCommit(event.item)
        break;
      default:
        break;
    }
  }

  onEdit(item: any) {
    this.inventoryAdjustmentDialog.title = 'Edit Inventory Adjustment';
    this.inventoryAdjustmentDialog.formData = item;
    this.inventoryAdjustmentDialog.lookupData = { 
      stacks$: this.stackQuery.selectAll(),
      unitOfMeasures$: this.uomQuery.selectAll()
    };
    DialogService.handleDialog(this.inventoryAdjustmentDialog);
  }

  onCommit(item: any) {
    this.blockUI.start('Committing....');
    this.service.commit(item.id).subscribe(
      (_:any) => this.blockUI.stop(),
      () => this.blockUI.stop()
    )
  }


}
