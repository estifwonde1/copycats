import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable } from 'rxjs';
import { DispatchTransactionQuery } from '../../../../dispatch/state/dispatch-transaction/dispatch-transaction.query';
import { DispatchTransactionService } from '../../../../dispatch/state/dispatch-transaction/dispatch-transaction.service';
import { StackQuery } from '../../../../floor-plan/state/stack/stack.query';
import { StackService } from '../../../../floor-plan/state/stack/stack.sevice';
import { StoreQuery } from '../../../../setup/state/store/store.query';
import { StoreService } from '../../../../setup/state/store/store.sevice';
import { Column } from '../../../../shared/models/column.model';
import { ReceiptTransactionQuery } from '../../../../storage/state/receipt-transaction/receipt-transaction.query';
import { ReceiptTransactionService } from '../../../../storage/state/receipt-transaction/receipt-transaction.service';
import { DispatchTransaction } from '../../../../dispatch/models/dispatch-transaction.model';
import { Stack } from '../../../../floor-plan/models/stack.model';
import { Store } from '../../../../setup/models/store.model';
import { ReceiptTransaction } from '../../../../storage/models/receipt-transaction.model';
import { SessionQuery } from '../../../../auth/state/session.query';
import { StackTransactionService } from '../../../../storage/state/stack-transaction/stack-transaction.service';
import { UnitConversionService } from '../../../../setup/state/unit-conversion/unit-conversion.service';
import { UnitConversionQuery } from '../../../../setup/state/unit-conversion/unit-conversion.query';
import { UnitOfMeasureQuery } from '../../../../dispatch/state/unit-of-measure/unit-of-measure.query';
import { UnitOfMeasureService } from '../../../../dispatch/state/unit-of-measure/unit-of-measure.service';
import { ConversionService } from '../../../../shared/services/conversion.service';

@Component({
  selector: 'cats-stack-card-report',
  templateUrl: './stack-card-report.component.html',
  styleUrls: ['./stack-card-report.component.scss']
})
export class StackCardReportComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  stores$: Observable<Store[]> = this.storeQuery.selectCurrentUserStores();
  stacks$: Observable<Stack[]> = this.stackQuery.selectAll();
  receiptTransactions$: Observable<ReceiptTransaction[]> = this.receiptTransactionQuery.selectAll();
  dispatchTransactions$: Observable<DispatchTransaction[]> = this.dispatchTransactionQuery.selectAll();
  
  selectedStore: any;
  selectedStack: any;
  selectedStackStatus: any;
  balance: number;
  dispatchTransactions: any[] = [];
  receiptTransactions: any[] = [];

  stackStatuses: any = [
    {name: 'Allocated', value: 'Allocated'},
    {name: 'Destroyed', value: 'Destroyed'}
  ]

  receiptColumns: Column[] = [
    { name: 'transaction_date', label: 'Date' },
    { name: 'receipt_number', label: 'Receipt No.' },
    { name: 'quantity', label: 'Quantity', },
    { name: 'unit_abbreviation', label: 'Unit', },
    { name: 'remark', label: 'Remark', },
  ];

  dispatchColumns: Column[] = [
    { name: 'transaction_date', label: 'Date' },
    { name: 'reference_no', label:'Receipt No.'},
    { name: 'quantity', label: 'Quantity', },
    { name: 'unit_abbreviation', label: 'Unit', },
    { name: 'remark', label: 'Remark', },
  ];

  constructor(private storeService: StoreService,
              private storeQuery: StoreQuery,
              private stackService: StackService,
              private stackQuery: StackQuery,
              private receiptTransactionService: ReceiptTransactionService,
              private receiptTransactionQuery: ReceiptTransactionQuery,
              private dispatchTransactionService: DispatchTransactionService,
              private dispatchTransactionQuery: DispatchTransactionQuery,
              private sessionQuery: SessionQuery,
              private stackTransactionService: StackTransactionService,
              private unitConversionService: UnitConversionService,
              private unitConversionQuery: UnitConversionQuery,
              private uomService: UnitOfMeasureService,
              private uomQuery: UnitOfMeasureQuery,
              private conversionService: ConversionService
              ) { }

  ngOnInit(): void {
    this.loadStores();
    this.loadUnitConversions();
    this.loadUnitOfMeasures();
  }

  loadStores() {
    this.blockUI.start('Loading...');
    this.storeService.getCurrentUserStores(this.sessionQuery.userId).subscribe(
      (_:any) => this.blockUI.stop(), () => this.blockUI.stop()
    );
  }

  loadUnitConversions() {
    this.blockUI.start('Loading...');
    this.unitConversionService.get().subscribe(
      (_: any) => this.blockUI.stop(), () => this.blockUI.stop()
    )
  }

  loadUnitOfMeasures() {
    this.blockUI.start('Loading...');
    this.uomService.get().subscribe(
      (_:any) => this.blockUI.stop(), () => this.blockUI.stop()
    )
  }

  onStoreChange(): void{
    this.selectedStack = null;
    this.receiptTransactionService.reset();
    this.dispatchTransactionService.reset();
    this.blockUI.start('Loading...');
    this.stackService.filter(this.selectedStore.id, {}).subscribe(
      (_:any) => this.blockUI.stop(), () => this.blockUI.stop()
    );
  }

  onStackStatusChange(): void {
    this.blockUI.start('Loading...');
    this.stackService.filter(this.selectedStore.id, {stack_status_eq: this.selectedStackStatus.value})
                     .subscribe(
                       (_:any) => this.blockUI.stop(),
                       () => this.blockUI.stop()
                     )
  }

  onStackChange() {
    this.dispatchTransactions = [];
    this.receiptTransactions = [];
    this.loadReceiptTransactions();
    this.loadDispatchTransactions();
    this.calculateBalance();
  }

  loadReceiptTransactions() {
    this.blockUI.start('Loading...');
    const criteria = { destination_id_eq: this.selectedStack.id, status_eq: 'Committed' };
    this.receiptTransactionService.filter(criteria).subscribe(
      (result: any) => {
        this.blockUI.stop();
        this.receiptTransactions = [...result.data];
        const query = {destination_id_eq: this.selectedStack.id, status: 'Committed'};
        this.loadStackToStackTransactions(query, 'receipt');
      },
      () => this.blockUI.stop()
    );
  }

  loadDispatchTransactions() {
    this.blockUI.start('Loading...');
    const criteria = { source_id_eq: this.selectedStack.id, status_eq: 'Committed' };
    this.dispatchTransactionService.filter(criteria).subscribe(
      (result: any) => { 
        this.blockUI.stop();
        this.dispatchTransactions = [...result.data];
        const query = {source_id_eq: this.selectedStack.id, status: 'Committed'};
        this.loadStackToStackTransactions(query, 'dispatch');
      }, () => this.blockUI.stop()
    );
  }

  loadStackToStackTransactions(criteria: any, type: string) {
    this.blockUI.start('Loading...');
    this.stackTransactionService.filter(criteria).subscribe(
      (result: any) => {
        this.blockUI.stop();
        let transactions: any[] = [];
        for(let r of result.data) {
          transactions.push({...r, receipt_number: 'STACK_TRANS', reference_no: 'STACK_TRANS'});
        }
        if(type === 'receipt') {
          this.receiptTransactions = [...this.receiptTransactions, ...transactions];
        } else if (type === 'dispatch') {
          this.dispatchTransactions = [...this.dispatchTransactions, ...transactions];
        }
      }
    );
  }

  calculateBalance() {
    const unitConversions = this.unitConversionQuery.getAll();
    const unitOfMeasures = this.uomQuery.getAll();
    const qt = unitOfMeasures.find((uc: any) => uc.abbreviation === 'qt');
    this.balance = this.conversionService.convert(unitConversions, this.selectedStack.unit_id ,qt.id,
                                                  this.selectedStack.quantity);
  }

}
