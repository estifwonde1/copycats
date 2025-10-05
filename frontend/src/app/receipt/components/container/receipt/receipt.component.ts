import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ConfirmationService } from 'primeng/api';
import { Observable } from 'rxjs';
import { EMPTY_RECEIPT, Receipt } from '../../../../receipt/models/receipt.model';
import { DispatchQuery } from '../../../../receipt/state/dispatch/dispatch.query';
import { DispatchService } from '../../../../receipt/state/dispatch/dispatch.sevice';
import { ReceiptQuery } from '../../../../receipt/state/receipt/receipt.query';
import { ReceiptService } from '../../../../receipt/state/receipt/receipt.sevice';
import { COMMODITY_STATUS } from '../../../../shared/constants/commodity-status.constant';
import { Column } from '../../../../shared/models/column.model';
import { DialogConfig } from '../../../../shared/models/dialog-config.model';
import { DialogService } from '../../../../shared/services/dialog.service';
import { SessionQuery } from '../../../../auth/state/session.query';
import { UtilService } from '../../../../shared/services/util.service';
import { ReceiptFormComponent } from '../../ui/receipt-form/receipt-form.component';
import { ReceiptAuthorizationService } from '../../../state/receipt-authorization/receipt-authorization.service';
import { ReceiptAuthorizationQuery } from '../../../state/receipt-authorization/receipt-authorization.query';
import { ReceiptAuthorization } from '../../../models/receipt-authorization.model';
import { LostCommodityService } from '../../../state/lost-commodity/lost-commodity.service';
import { LostCommodityQuery } from '../../../state/lost-commodity/lost-commodity.query';
import { EMPTY_LOST_COMMODITY, LostCommodity } from '../../../models/lost-commodity.model';
import { LostCommodityFormComponent } from '../../ui/lost-commodity-form/lost-commodity-form.component';
import { COMMODITY_GRADE } from '../../../../shared/constants/commodity-grade.constant';
import { GrnFormComponent } from '../../ui/grn-form/grn-form.component';

@Component({
  selector: 'cats-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI: NgBlockUI;

  selectedReceiptAuthorization: ReceiptAuthorization;
  receiptAuthorizations$: Observable<ReceiptAuthorization[]> = this.receiptAuthorizationQuery.selectReceiptAuthorizations();
  receipts$: Observable<Receipt[]> = this.query.selectAll();
  receipt :Receipt; 
  lostCommodities$: Observable<LostCommodity[]> = this.lostCommodityQuery.selectAll();
  selectedReceiptAuthorization$: Observable<ReceiptAuthorization>;
  commodity$: Observable<any> = this.dispatchQuery.selectCommodity();
  receiptAuthorizationQuantity: number;
  currentReceiptQuantity = 0;
  currentLostQuantity = 0;
  currentReceiptQuantity$: Observable<number> = this.query.selectCurrentQuantity();
  currentLostQuantity$: Observable<number> = this.lostCommodityQuery.selectCurrentQuantity();

  columns: Column[] = [
    {name:'reference_no',label:'Receipt Number'},
    { name: 'commodity_status', label: 'Commodity Status'},
    { name: 'commodity_grade', label: 'Commodity Grade'},
    { name: 'quantity', label: 'Quantity' },
    { name: 'unit_abbreviation', label: 'Unit'},
    { name: 'remark', label: 'Remark'},
  ];

  lostCommodityColumns: Column[] = [
    { name: 'quantity', label: 'Quantity' },
    { name: 'unit_abbreviation', label: 'Unit'},
    { name: 'remark', label: 'Remark'},
  ];

  caption = 'Receipts';

  actions: any[] = [
    { icon: 'add', label: 'New', disabled: true },
  ];
  
  confirmAction: any[] = [
    { icon: 'done_outline', label: 'Confirm', disabled: true},
    { icon: 'description', label: 'Download GRN', disabled: true},
  ];

  tableActions = [
    { icon: 'edit', color: 'warn', tooltip: 'Edit', disable: () => false},
  ];

  dialogConfig: DialogConfig = {
    width: '800px',
    formComponent: ReceiptFormComponent,
    dialog: this.dialog,
    service: this.service,
    parentComponent: this
  } as DialogConfig;

  lostCommodityDialogConfig: DialogConfig = {
    width: '800px',
    formComponent: LostCommodityFormComponent,
    dialog: this.dialog,
    service: this.lostCommodityService,
    parentComponent: this
  } as DialogConfig;

  constructor(private service: ReceiptService,
              private query: ReceiptQuery,
              private dispatchService: DispatchService,
              private dispatchQuery: DispatchQuery,
              private dialog: MatDialog,
              private sessionQuery: SessionQuery,
              private utilService: UtilService,
              private confirmationService: ConfirmationService,
              private receiptAuthorizationService: ReceiptAuthorizationService,
              private receiptAuthorizationQuery: ReceiptAuthorizationQuery,
              private lostCommodityService: LostCommodityService,
              private lostCommodityQuery: LostCommodityQuery) { }

  ngOnInit(): void {
    this.loadReceiptAuthorizations(); 
  }

  loadReceiptAuthorizations(): void {
    const userId = this.sessionQuery.userId;
    this.blockUI.start('Loading...');
    this.receiptAuthorizationService.getCurrentUserAuthorizations(userId).subscribe(
      () => this.blockUI.stop(), () => this.blockUI.stop()
    )
  }

  loadCommodity(): void {
    this.blockUI.start('Loading...');
    this.dispatchService.getCommodity(this.selectedReceiptAuthorization.dispatch_id).subscribe(
      () => this.blockUI.stop(), () => this.blockUI.stop()
    );
  }

  onReceiptAuthorizationChange(): void {
    this.loadReceipts();
    this.loadLostCommodities();
    this.loadCommodity();
    this.actions[0].disabled = false;
    this.receiptAuthorizationQuantity = this.receiptAuthorizationQuery.getEntity(this.selectedReceiptAuthorization.id)?.quantity;
    this.selectedReceiptAuthorization$ = this.receiptAuthorizationQuery.selectEntity(this.selectedReceiptAuthorization.id);
    this.disabledActions();
  }

  disabledActions(): void {
    this.selectedReceiptAuthorization$.subscribe((sd) => {
      if (sd?.status === 'Confirmed') {
        this.actions.map(action => action.disabled = true);
        this.confirmAction.map(action => action.disabled = true);
        this.confirmAction[1].disabled = false;
        this.tableActions.map(action => action.icon === 'edit' ? action.disable = () => true : action.disable = () => false);
      } else if (sd?.status === 'Authorized') {
        this.confirmAction[0].disabled = false;
      }
    });
  }

  setCurrentReceiptQuantity(): void {
    this.receipts$.subscribe(res => {
      this.currentReceiptQuantity = res.map(r => r.quantity).reduce((prev, curr) => prev += curr, 0);
    });
  }

  setCurrentLostQuantity(): void {
    this.lostCommodities$.subscribe(res => {
      this.currentLostQuantity = res.map(r => r.quantity).reduce((prev, curr) => prev += curr, 0);
    });
  }

  loadReceipts(): void {
    this.blockUI.start('Loading...');
    this.service.get(this.selectedReceiptAuthorization.id).subscribe(
      (data) => {this.blockUI.stop(); this.receipt = data.data[0];}, () => this.blockUI.stop()
    );
  }

  loadLostCommodities(): void {
    this.blockUI.start('Loading...');
    this.lostCommodityService.get(this.selectedReceiptAuthorization.id).subscribe(
      () => this.blockUI.stop(), () => this.blockUI.stop()
    );
  }

  onToolbarActionClick(event: any) {
    switch(event.label) {
      case 'Confirm':
        this.confirm();
        break;
      case 'Download GRN':
        this.onDownloadGrn();
        break;
      case 'New':
        this.onCreate();
        break;
      default:
        break;
    }
  }

  onDownloadGrn(): void {
    const dialogRef = this.dialog.open(GrnFormComponent, {
      data :{
        receipt_no:this.receipt.reference_no,
      },
      disableClose: true,
      width: '1000px'
    });

    const sub1 = (dialogRef.componentInstance as any).formSubmit.subscribe((data: any) => {
      const payload = {
        ...data, 
        id: this.selectedReceiptAuthorization.id
      };
      this.receiptAuthorizationService.downloadGrn(payload).subscribe((data: any) => {
        const blob = new Blob([data]);
        const url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.href = url;
        a.download = 'receiving_receipt_template.docx';
        a.click();
        URL.revokeObjectURL(a.href);
        dialogRef.close();
      })
    });
    const closeSub = (dialogRef.componentInstance as any).formClose.subscribe(() => dialogRef.close());

    dialogRef.afterClosed().subscribe(() => {
      sub1.unsubscribe();
      closeSub.unsubscribe();
    })
  }

  onClick(event: any) {
    switch (event.type) {
      case 'edit':
        this.onEdit(event.item);
        break;
      default:
        break;
    }
  }

  onCreate(): void {
    this.setCurrentReceiptQuantity();
    this.setCurrentLostQuantity();
    this.dialogConfig.title = 'Receive New Commodities';
    this.dialogConfig.lookupData = {
      commodityStatuses: COMMODITY_STATUS,
      commodityGrades: COMMODITY_GRADE,
      maximumQuantity: this.receiptAuthorizationQuantity - (this.currentReceiptQuantity + this.currentLostQuantity)
    }
    this.dialogConfig.formData = {
      ...EMPTY_RECEIPT,
      receipt_authorization_id: this.selectedReceiptAuthorization.id,
      prepared_by_id: this.sessionQuery.userId
    };
    DialogService.handleDialog(this.dialogConfig);
  }

  onEdit(item: any): void {
    this.setCurrentReceiptQuantity();
    this.setCurrentLostQuantity();
    this.dialogConfig.title = 'Edit Receipt';
    this.dialogConfig.lookupData = {
      commodityStatuses: COMMODITY_STATUS,
      commodityGrades: COMMODITY_GRADE,
      maximumQuantity: this.receiptAuthorizationQuantity - (this.currentReceiptQuantity + this.currentLostQuantity) + item.quantity
    }
    this.dialogConfig.formData = {
      ...item, 
      receipt_authorization_id: this.selectedReceiptAuthorization.id,
      prepared_by_id: this.sessionQuery.userId
    }
    DialogService.handleDialog(this.dialogConfig);
  }

  onLostCommodityRegister() {
    this.setCurrentReceiptQuantity();
    this.setCurrentLostQuantity();
    this.lostCommodityDialogConfig.title = 'Register Lost Commodities';
    this.lostCommodityDialogConfig.lookupData = {
      maximumQuantity: this.receiptAuthorizationQuantity - (this.currentReceiptQuantity + this.currentLostQuantity)
    }
    this.lostCommodityDialogConfig.formData = {
        ...EMPTY_LOST_COMMODITY,
        receipt_authorization_id: this.selectedReceiptAuthorization.id
    };
    DialogService.handleDialog(this.lostCommodityDialogConfig);
  }

  onLostCommodityEdit(event: any) {
    this.setCurrentReceiptQuantity();
    this.setCurrentLostQuantity();
    const lostCommodity = event.item;
    this.lostCommodityDialogConfig.title = 'Edit Lost Commodity';
    this.lostCommodityDialogConfig.lookupData = {
      maximumQuantity: this.receiptAuthorizationQuantity - (this.currentReceiptQuantity + this.currentLostQuantity) + lostCommodity.quantity
    }
    this.lostCommodityDialogConfig.formData = lostCommodity;
    DialogService.handleDialog(this.lostCommodityDialogConfig);
  }

  onConfirm(): void {
    this.setCurrentReceiptQuantity();
    this.setCurrentLostQuantity();
    if (this.currentReceiptQuantity + this.currentLostQuantity < this.receiptAuthorizationQuantity) {
      this.utilService.showMessage(
        'error', 
        'Error', 
        `There is an amount of ${this.receiptAuthorizationQuantity - (this.currentReceiptQuantity + this.currentLostQuantity)} 
        in the dispatch which is unaccounted for.`
        );
    } else {
      this.blockUI.start('Confirming...');
      this.receiptAuthorizationService.confirm(this.selectedReceiptAuthorization.id).subscribe(
        () => this.blockUI.stop(), () => this.blockUI.stop()
      );
      this.disabledActions();
    }
    this.loadReceipts();
  }

  confirm() {
    this.confirmationService.confirm({
        message: 'Are you sure that you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.onConfirm();
        }
    });
  }

  ngOnDestroy(): void {
    this.service.reset();
    this.dispatchService.reset();
  }
  
}
