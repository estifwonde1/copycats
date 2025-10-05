import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable } from 'rxjs';
import { SessionQuery } from '../../../../auth/state/session.query';
import { SessionService } from '../../../../auth/state/session.service';
import { USER_ROLES } from '../../../../shared/constants/user-roles.constant';
import { Column } from '../../../../shared/models/column.model';
import { DialogConfig } from '../../../../shared/models/dialog-config.model';
import { DialogService } from '../../../../shared/services/dialog.service';
import { EMPTY_STORE, Store } from '../../../models/store.model';
import { StoreQuery } from '../../../state/store/store.query';
import { StoreService } from '../../../state/store/store.sevice';
import { StoreFormComponent } from '../../ui/store-form/store-form.component';

@Component({
  selector: 'cats-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI: NgBlockUI;

  columns: Column[] = [
    { name: 'code', label: 'Code' },
    { name: 'name', label: 'Name' },
    { name: 'length', label: 'Length', },
    { name: 'width', label: 'Width', },
    { name: 'height', label: 'Height', }
  ];

  actions: any[] = [
    { icon: 'add', label: 'New', disabled: true}
  ];

  tableActions = [
    { icon: 'edit', color: 'warn', tooltip: 'Edit'}
  ];

  dialogConfig: DialogConfig = {
    width: '800px',
    formComponent: StoreFormComponent,
    dialog: this.dialog,
    service: this.service,
    parentComponent: this
  } as DialogConfig;

  stores$: Observable<Store[]> = this.query.selectAll();
  loading$: Observable<boolean> = this.query.selectLoading();
  storeKeepers$: Observable<any[]> = this.sessionQuery.selectUsersByRole();
  currentUserWarehouses$: Observable<any[]> = this.query.selectCurrentUserWarehouses();
  selectedWarehouse: any;
  currentUserId: number;

  constructor(private service: StoreService,
              private query: StoreQuery,
              private dialog: MatDialog,
              private sessionService: SessionService,
              private sessionQuery: SessionQuery) { }

  ngOnInit(): void {
    this.currentUserId = this.sessionQuery.userId;
    this.sessionService.getUsersByRole(USER_ROLES.STORE_KEEPER).subscribe();
    this.service.currentUserWarehouses(this.currentUserId).subscribe();
  }


  onCreate(): void {
    this.dialogConfig.title = 'Add New Store';
    this.dialogConfig.lookupData = {
     storeKeepers$: this.storeKeepers$,
     currentUserWarehouses$: this.currentUserWarehouses$
    };
    this.dialogConfig.formData = {
      ...EMPTY_STORE, warehouse_id: this.selectedWarehouse?.id
    };
    DialogService.handleDialog(this.dialogConfig);
  }

  onEdit(event: any) {
    const store: Store = event?.item;
    this.dialogConfig.title = 'Edit Store';
    this.dialogConfig.lookupData = {
      storeKeepers$: this.storeKeepers$,
      currentUserWarehouses$: this.currentUserWarehouses$
     };
    this.dialogConfig.formData = {
      ...store, warehouse_id: this.selectedWarehouse?.id
    };
    DialogService.handleDialog(this.dialogConfig);
  }

  onWarehouseChange(): void {
    this.actions[0].disabled = false;
    this.fetchStores();
  }

  fetchStores(): void {
    this.blockUI.start('Loading...');
    this.service.get(this.selectedWarehouse.id).subscribe(
      (_: any) => this.blockUI.stop(), () => this.blockUI.stop()
    );
  }

  ngOnDestroy(): void {
    this.service.reset();
  }
}
