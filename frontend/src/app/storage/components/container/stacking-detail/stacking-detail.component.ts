import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Receipt } from '../../../../receipt/models/receipt.model';
import { StackQuery } from '../../../../floor-plan/state/stack/stack.query';
import { StackService } from '../../../../floor-plan/state/stack/stack.sevice';
import { ReceiptService } from '../../../../receipt/state/receipt/receipt.sevice';
import { Column } from '../../../../shared/models/column.model';
import { DialogConfig } from '../../../../shared/models/dialog-config.model';
import { DialogService } from '../../../../shared/services/dialog.service';
import { EMPTY_RECEIPT_TRANSACTION } from '../../../../storage/models/receipt-transaction.model';
import { ReceiptTransactionQuery } from '../../../../storage/state/receipt-transaction/receipt-transaction.query';
import { ReceiptTransactionService } from '../../../../storage/state/receipt-transaction/receipt-transaction.service';
import { StackingDetailFormComponent } from '../../ui/stacking-detail-form/stacking-detail-form.component';
import { DispatchService } from '../../../../receipt/state/dispatch/dispatch.sevice';
import { DispatchQuery } from '../../../../receipt/state/dispatch/dispatch.query';
import { Observable, of } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { SessionQuery } from '../../../../auth/state/session.query';
import { ReceiptAuthorizationService } from '../../../../receipt/state/receipt-authorization/receipt-authorization.service';
import { ReceiptAuthorizationQuery } from '../../../../receipt/state/receipt-authorization/receipt-authorization.query';
import { ReceiptAuthorization } from '../../../../receipt/models/receipt-authorization.model';
import { ReceiptAuthorizationStore } from 'src/app/receipt/state/receipt-authorization/receipt-authorization.store';

@Component({
  selector: 'cats-stacking-detail',
  templateUrl: './stacking-detail.component.html',
  styleUrls: ['./stacking-detail.component.scss']
})
export class StackingDetailComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI: NgBlockUI;
  actions: any = [];
  receiptAuthorizations$ = this.receiptAuthorizationQuery.selectUnstackedReceiptAuthorization();
  selectedAuthorizedReceipt: any;
  selectedAuthorizedReceipt$: Observable<any>;

  receiptTransactions$ = this.query.selectAll();
  stacks$ = this.stackQuery.selectAll();
  commodity$: Observable<any> = this.dispatchQuery.selectCommodity();
  receiptAuthorizationQuantity: number;
  currentStackingQuantity = 0;

  currentStackingQuantity$: Observable<number> = this.query.selectCurrentQuantity();
  
  
  columns: Column[] = [
    { name: 'receipt_number', label: 'Receipt Number', },
    { name: 'destination_code', label: 'Destination' },
    { name: 'quantity', label: 'Quantity', },
    { name: 'unit_abbreviation', label: 'Unit', },
    { name: 'transaction_date', label: 'Transaction Date', },
  ];

  tableActions = [
    { icon: 'edit', color: 'warn', tooltip: 'Edit', disable: this.cannotEdit },
  ];

  stackingDialog: DialogConfig = {
    title: 'Stack Commodity',
    formData: '',
    width: '800px',
    formComponent: StackingDetailFormComponent,
    dialog: this.dialog,
    service: this.service,
    lookupData: '',
    parentComponent: this
  } as DialogConfig;

  constructor(private dialog: MatDialog,
              private service: ReceiptTransactionService,
              private query: ReceiptTransactionQuery,
              private receiptService: ReceiptService,
              private dispatchService: DispatchService,
              private dispatchQuery: DispatchQuery,
              private stackQuery: StackQuery,
              private stackService: StackService,
              private confirmationService: ConfirmationService,
              private sessionQuery: SessionQuery,
              private receiptAuthorizationService: ReceiptAuthorizationService,
              private receiptAuthorizationStore: ReceiptAuthorizationStore,
              private receiptAuthorizationQuery: ReceiptAuthorizationQuery) { }

  ngOnInit(): void {
    this.actions = [
      { color: 'success', label: 'Driver Confirm', disabled: false, icon: 'checkbox' },
      { color: 'success', label: 'New', disabled: false, icon: 'add_circle' },
      { color: 'success', label: 'Complete', disabled: false, icon: 'done_outline' },
    ];
   
    this.loadReceiptAuthorizations();
  }

  cannotEdit({icon}: any, {status}: any): boolean {
    return icon === 'edit' && status === 'Committed'
  }

  disableAndEnableActionButtons() {
    this.selectedAuthorizedReceipt$.subscribe((result: any) => {
      if(result.driver_confirmed) {
        this.actions[0].disabled = true;
        this.actions[1].disabled = this.actions[2].disabled = false;
      } else {
        this.actions[0].disabled = false;
        this.actions[1].disabled = this.actions[2].disabled = true;
      }
    })
  }

  loadReceiptAuthorizations(): void {
    const userId = this.sessionQuery.userId;
    this.blockUI.start('Loading...');
    this.receiptAuthorizationService.getCurrentUserAuthorizations(userId, 'Confirmed').subscribe(
      () => this.blockUI.stop(), () => this.blockUI.stop()
    )
  }

  onAuthorizedReceiptChange(): void {
    this.loadCommodity(this.selectedAuthorizedReceipt.dispatch_id);
    this.loadReceiptTransactions();
    this.receiptAuthorizationQuantity = this.receiptAuthorizationQuery.getEntity(this.selectedAuthorizedReceipt.id)?.received_quantity;
    this.selectedAuthorizedReceipt$ = this.receiptAuthorizationQuery.selectEntity(this.selectedAuthorizedReceipt.id);
    this.disableAndEnableActionButtons();
  }

  toggleNewBtn(): void {
    this.selectedAuthorizedReceipt$.subscribe((receiptAuth: ReceiptAuthorization) => {
      if (receiptAuth?.dispatch_status === 'Stacked') {
        this.receiptTransactions$.subscribe((rt) => {
          if (rt.length > 0) {
            this.actions[1].disabled = false;
          }
        })
      } else {
        this.actions[1].disabled = true;
      }
    })
  }


  setCurrentStackingQuantity(): void {
    this.receiptTransactions$.subscribe(res => {
      this.currentStackingQuantity = res.map(r => r.quantity).reduce((prev, curr) => prev += curr, 0);
    });
  }

  onToolbarActionClick(event: any) {
    switch(event.label) {
      case 'Complete':
        this.confirm(this.onComplete.bind(this));
        break;
      case 'Driver Confirm':
        this.confirm(this.onDriverConfirm.bind(this));
        break;
      case 'New':
        this.onAddButtonClick();
        break;
      default:
        break;
    }
  }

  onAddButtonClick() {
    this.setCurrentStackingQuantity();
    this.stackingDialog.formData = { 
      ...EMPTY_RECEIPT_TRANSACTION, 
      receipt_authorization_id: this.selectedAuthorizedReceipt.id,
    };
    this.stackingDialog.lookupData = { 
      stacks: this.stacks$,
      maximumQuantity: this.receiptAuthorizationQuantity - this.currentStackingQuantity
    };
    DialogService.handleDialog(this.stackingDialog);
  }

  onTableActionClick(event: any) {
    switch (event.type) {
      case 'edit':
        this.onEdit(event.item);
        break;
      default:
        break;
    }
  }

  onEdit(item: any) {
    this.stackingDialog.title = 'Edit Stacking';
    this.stackingDialog.formData = item;
    this.stackingDialog.lookupData = { 
      stacks: this.stacks$,
      maximumQuantity: this.receiptAuthorizationQuantity - this.currentStackingQuantity + item.quantity
    };
    DialogService.handleDialog(this.stackingDialog);
  }

  onComplete() {
    this.blockUI.start('Loading...');
    this.receiptAuthorizationService.complete(this.selectedAuthorizedReceipt.id).subscribe(
      (res: any) => { 
        this.blockUI.stop();
        if(res.success){
          this.receiptAuthorizationStore.remove(this.selectedAuthorizedReceipt.id);
        }
      }, () => this.blockUI.stop()
    );
  }

  onDriverConfirm() {
    const pin = this.selectedAuthorizedReceipt?.auth_details?.pin;
    this.blockUI.start('Loading...');
    this.receiptAuthorizationService.driverConfirm(this.selectedAuthorizedReceipt?.id, {pin}).subscribe(
      (_: any) => { 
        this.blockUI.stop()
      }, () => this.blockUI.stop()
    );
  }

  loadCommodity(dispatchId: any): void {
    this.blockUI.start('Loading...');
    this.dispatchService.getCommodity(dispatchId).subscribe(
      () => {
        this.blockUI.stop();
        
      }, () => this.blockUI.stop()
    );
  }

  loadReceiptTransactions() {
    this.blockUI.start('Loading...');
    this.service.get(this.selectedAuthorizedReceipt.id).subscribe(
      (_: any) => {
        this.blockUI.stop();
      }, () => this.blockUI.stop()
    );
    this.stackService.commodityStack(this.selectedAuthorizedReceipt.id).subscribe();
  }

  confirm(acceptFunc: any) {
    this.confirmationService.confirm({
        message: 'Are you sure that you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            acceptFunc();
        }
    });
  }

  ngOnDestroy() {
    this.service.reset();
  }
}
