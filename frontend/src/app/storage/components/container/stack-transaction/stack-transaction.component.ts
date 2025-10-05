import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ConfirmationService } from 'primeng/api';
import { SessionQuery } from '../../../../auth/state/session.query';
import { UnitOfMeasureQuery } from '../../../../dispatch/state/unit-of-measure/unit-of-measure.query';
import { UnitOfMeasureService } from '../../../../dispatch/state/unit-of-measure/unit-of-measure.service';
import { StackQuery } from '../../../../floor-plan/state/stack/stack.query';
import { StackService } from '../../../../floor-plan/state/stack/stack.sevice';
import { StoreQuery } from '../../../../setup/state/store/store.query';
import { StoreService } from '../../../../setup/state/store/store.sevice';
import { Column } from '../../../../shared/models/column.model';
import { DialogConfig } from '../../../../shared/models/dialog-config.model';
import { DialogService } from '../../../../shared/services/dialog.service';
import { EMPTY_STACK_TRANSACTION } from '../../../../storage/models/stack-transaction.model';
import { StackTransactionQuery } from '../../../../storage/state/stack-transaction/stack-transaction.query';
import { StackTransactionService } from '../../../../storage/state/stack-transaction/stack-transaction.service';
import { StackTransactionFormComponent } from '../../ui/stack-transaction-form/stack-transaction-form.component';

@Component({
  selector: 'cats-stack-transaction',
  templateUrl: './stack-transaction.component.html',
  styleUrls: ['./stack-transaction.component.scss']
})
export class StackTransactionComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI: NgBlockUI;
  actions: any = [];
  stores$ = this.storeQuery.selectCurrentUserStores();
  stacks$ = this.stackQuery.selectAll();
  stackTransactions$ = this.query.selectAll();
  unitOfMeasures$ = this.uomQuery.selectAll();
  selectedStore: any;
  selectedStack: any;  
  
  columns: Column[] = [
    { name: 'source_code', label: 'Source' },
    { name: 'destination_code', label: 'Destination' },
    { name: 'quantity', label: 'Quantity', },
    { name: 'unit_abbreviation', label: 'Unit', },
    { name: 'transaction_date', label: 'Transaction Date', },
    { name: 'status', label: 'Status', },
  ];

  tableActions = [
    { icon: 'edit', color: 'warn', tooltip: 'Edit', disable: this.cannotEdit },
    { icon: 'assignment_turned_in', color: 'warn', tooltip: 'Edit' },
  ];

  stackTransactionDialog: DialogConfig = {
    title: 'Stack Transaction',
    formData: '',
    width: '800px',
    formComponent: StackTransactionFormComponent,
    dialog: this.dialog,
    service: this.service,
    lookupData: '',
    parentComponent: this
  } as DialogConfig;

  constructor(private dialog: MatDialog,
              private service: StackTransactionService,
              private query: StackTransactionQuery,
              private stackQuery: StackQuery,
              private stackService: StackService,
              private confirmationService: ConfirmationService,
              private sessionQuery: SessionQuery,
              private storeService: StoreService,
              private storeQuery: StoreQuery,
              private uomService: UnitOfMeasureService,
              private uomQuery: UnitOfMeasureQuery) { }

  ngOnInit(): void {
    this.actions = [
      { color: 'success', label: 'New', disabled: true, icon: 'add_circle' }
    ];
   
    this.loadStores();
    this.loadUnitOfMeasures();
  }

  cannotEdit({icon}: any, {status}: any): boolean {
    return icon === 'edit' && status === 'Committed'
  }

  loadUnitOfMeasures() {
    this.blockUI.start('Loading...');
    this.uomService.get().subscribe(
      (_:any) => this.blockUI.stop(), () => this.blockUI.stop()
    )
  }

  loadStores(): void {
    const userId = this.sessionQuery.userId;
    this.blockUI.start('Loading...');
    this.storeService.getCurrentUserStores(userId).subscribe(
      () => this.blockUI.stop(), () => this.blockUI.stop()
    )
  }

  onStoreChange(): void {
    this.blockUI.start('Loading...');
    this.stackService.get(this.selectedStore.id).subscribe(
      (_:any) => this.blockUI.stop(), () => this.blockUI.stop()
    )
  }

  onStackChange(): void {
    this.blockUI.start('Loading...');
    this.service.filter({source_id_eq: this.selectedStack.id, status_eq: 'Draft'}).subscribe(
      (_:any) => this.blockUI.stop(), () => this.blockUI.stop()
    )
    this.actions[0].disabled = false;
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
    this.stackTransactionDialog.formData = { 
      ...EMPTY_STACK_TRANSACTION, 
      source_stack_id: this.selectedStack.id,
    };
    this.stackTransactionDialog.lookupData = { 
      stacks$: this.stackQuery.getAllExcept(this.selectedStack.id),
      unitOfMeasures$: this.unitOfMeasures$
    };
    DialogService.handleDialog(this.stackTransactionDialog);
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
    this.stackTransactionDialog.title = 'Edit Stack Transaction';
    this.stackTransactionDialog.formData = item;
    this.stackTransactionDialog.lookupData = { 
      stacks$: this.stackQuery.getAllExcept(this.selectedStack.id),
      unitOfMeasures$: this.unitOfMeasures$
    };
    DialogService.handleDialog(this.stackTransactionDialog);
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

  onCommit(item: any) {
    this.blockUI.start('Committing....');
    this.service.commit(item.id).subscribe(
      (_:any) => this.blockUI.stop(),
      () => this.blockUI.stop()
    )
  }

  ngOnDestroy() {
    this.service.reset();
  }

}
