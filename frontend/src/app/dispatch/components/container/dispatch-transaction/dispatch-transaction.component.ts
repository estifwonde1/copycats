import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ConfirmationService } from 'primeng/api';
import { Observable } from 'rxjs/internal/Observable';
import { SessionQuery } from '../../../../auth/state/session.query';
import { Stack } from '../../../../floor-plan/models/stack.model';
import { StackQuery } from '../../../../floor-plan/state/stack/stack.query';
import { StackService } from '../../../../floor-plan/state/stack/stack.sevice';
import { DispatchQuery } from '../../../../receipt/state/dispatch/dispatch.query';
import { Column } from '../../../../shared/models/column.model';
import { DialogConfig } from '../../../../shared/models/dialog-config.model';
import { DialogService } from '../../../../shared/services/dialog.service';
import { UtilService } from '../../../../shared/services/util.service';
import { DispatchAuthorization } from '../../../models/dispatch-authorization.model';
import { DispatchTransaction, EMPTY_DISPATCH_TRANSACTION } from '../../../models/dispatch-transaction.model';
import { DispatchAuthorizationQuery } from '../../../state/dispatch-authorization/dispatch-authorization.query';
import { DispatchAuthorizationService } from '../../../state/dispatch-authorization/dispatch-authorization.service';
import { DispatchTransactionQuery } from '../../../state/dispatch-transaction/dispatch-transaction.query';
import { DispatchTransactionService } from '../../../state/dispatch-transaction/dispatch-transaction.service';
import { DispatchTransactionFormComponent } from '../../ui/dispatch-transaction-form/dispatch-transaction-form.component';
import { GinFormComponent } from '../../ui/gin-form/gin-form.component';

@Component({
  selector: 'cats-dispatch-transaction',
  templateUrl: './dispatch-transaction.component.html',
  styleUrls: ['./dispatch-transaction.component.scss']
})
export class DispatchTransactionComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  authorizedDispatches$: Observable<DispatchAuthorization[]> = this.dispatchAuthorizationQuery.selectDispatchAuthorizations();
  selectedAuthorizedDispatch: DispatchAuthorization;
  selectedAuthorizedDispatch$: Observable<DispatchAuthorization>;
  dispatchTransactions$: Observable<DispatchTransaction[]>;
  dispatchTransaction: DispatchTransaction =EMPTY_DISPATCH_TRANSACTION;
  currentTransactionQuantity = 0;
  currentReceiptQuantity$: Observable<number> = this.query.selectCurrentQuantity();
  authorizedDispatchQuantity: number;
  
  stacks$: Observable<Stack[]> = this.stackQuery.selectAll();
  loading$: Observable<boolean> = this.query.selectLoading();
  columns: Column[] = [
    {name:'reference_no',label:'Receipt Number'},
    { name: 'source_code', label: 'Source' },
    { name: 'quantity', label: 'Quantity'},
  ];

  caption = 'Dispatch Transactions';

  actions: any[] = [
    { icon: 'add_circle', label: 'New', disabled: false},
    { icon: 'done_outline', label: 'Confirm', disabled: false},
    { icon: 'description', label: 'Download GIN', disabled: false}
  ];

  tableActions: any[] = [
    { icon: 'edit', color: 'warn', tooltip: 'Edit'},
  ];

  dialogConfig: DialogConfig = {
    width: '800px',
    formComponent: DispatchTransactionFormComponent,
    dialog: this.dialog,
    service: this.service,
    parentComponent: this
  } as DialogConfig;
  constructor(private query: DispatchTransactionQuery,
              private service: DispatchTransactionService,
              private dispatchQuery: DispatchQuery,
              private dialog: MatDialog,
              private stackService: StackService,
              private stackQuery: StackQuery,
              private confirmationService: ConfirmationService,
              private utilService: UtilService,
              private dispatchAuthorizationService: DispatchAuthorizationService,
              private dispatchAuthorizationQuery: DispatchAuthorizationQuery,
              private sessionQuery: SessionQuery) { }

  ngOnInit(): void {
    this.loadAuthorizedDispatches();
  }

  onToolbarActionClick(event: any) {
    switch(event.label) {
      case 'Confirm':
        this.confirm();
        break;
      case 'New':
        this.onCreate();
        break;
      case 'Download GIN':
        this.onDownloadGin();
        break;
      default:
        break;
    }
  }

  loadAuthorizedDispatches(): void {
        const userId = this.sessionQuery.userId;
        this.blockUI.start('Loading...');
        this.dispatchAuthorizationService.getCurrentUserAuthorizations(userId).subscribe(
          () => this.blockUI.stop(), () => this.blockUI.stop()
        )
  }

  disabledActions(): void {
    this.selectedAuthorizedDispatch$.subscribe((sd) => {
      if (sd?.status === 'Confirmed') {
        this.actions.map(action => action.disabled = true);
        this.actions[2].disabled = false;
        this.tableActions.map(action =>  action.disable = () => true);
      } else if (sd?.status === 'Authorized') {
        this.actions.map(action => action.disabled = false);
        this.actions[2].disabled = true;
      }
    });
  }

  loadStacks(): void {
    this.blockUI.start('Loading...');
    this.stackService.dispatchStacks(this.selectedAuthorizedDispatch.dispatch_id).subscribe(() => {
      this.blockUI.stop()
    }, () => this.blockUI.stop());
  }

  setCurrentTransactionQuantity(): void {
    this.dispatchTransactions$.subscribe(res => {
      this.currentTransactionQuantity = res.map(r => r.quantity).reduce((prev, curr) => prev += curr, 0);
    });
  }

  toggleActionButtonState(dispatchId: any): void {
    this.dispatchQuery.selectEntity(dispatchId).subscribe((dispatch: any)=>{
      if (dispatch?.dispatch_status !== 'Draft') {
        this.actions[0].disabled = true;
        this.tableActions[0].disable = () => true;
      } else {
        this.actions[0].disabled = false;
        this.tableActions[0].disable = () => false;
      }
    });
  }


  loadDistpatchTransactions(): void {
    this.blockUI.start('Loading...');
    this.service.get(this.selectedAuthorizedDispatch.id).subscribe(
      (data) => {this.blockUI.stop(); this.dispatchTransaction = data.data[0];}, () => this.blockUI.stop()
    )
  }

  onAuthorizedDispatchChange(): void {
    this.loadDistpatchTransactions();
    this.loadStacks();
    this.selectedAuthorizedDispatch$ = this.dispatchAuthorizationQuery.selectEntity(this.selectedAuthorizedDispatch.id);
    this.disabledActions();
    this.dispatchTransactions$ = this.query.selectAll();
    this.authorizedDispatchQuantity = this.dispatchAuthorizationQuery.getEntity(this.selectedAuthorizedDispatch.id)?.quantity;
  }

  onConfirm(): void {
    this.setCurrentTransactionQuantity();
    if (this.currentTransactionQuantity < this.authorizedDispatchQuantity) {
      this.utilService.showMessage(
        'error', 
        'Error', 
        `There is an amount of ${this.authorizedDispatchQuantity - this.currentTransactionQuantity} 
        in the dispatch authorization which is unaccounted for.`
        );
    } else {
      this.blockUI.start('Confirming...');
      this.dispatchAuthorizationService.confirm(this.selectedAuthorizedDispatch.id).subscribe(
        () => this.blockUI.stop(), () => this.blockUI.stop()
      );
      this.disabledActions();
    }
    this.loadDistpatchTransactions();
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

  onDownloadGin(): void {
    const dialogRef = this.dialog.open(GinFormComponent, {
      data :{
        receipt_no:this.dispatchTransaction.reference_no,
      },
      disableClose: true,
      width: '1000px'
    });

    const sub1 = (dialogRef.componentInstance as any).formSubmit.subscribe((data: any) => {
      const payload = {
        ...data, 
        id: this.selectedAuthorizedDispatch.id
      };
      this.dispatchAuthorizationService.downloadGin(payload).subscribe((data: any) => {
        const blob = new Blob([data]);
        const url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.href = url;
        a.download = 'issue_receipt_template.docx';
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

  onEdit(event: any): void {
    this.setCurrentTransactionQuantity();
    this.dialogConfig.title = 'Edit Dispatch Transaction';
    this.dialogConfig.lookupData = {
      stacks$: this.stacks$,
      maximumQuantity: this.authorizedDispatchQuantity - this.currentTransactionQuantity + event?.item?.quantity
    };
    this.dialogConfig.formData = event?.item;
    DialogService.handleDialog(this.dialogConfig);
  }

  onCreate(): void {
    this.setCurrentTransactionQuantity();
    this.dialogConfig.title = 'Add New Dispatch Transaction';
    this.dialogConfig.lookupData = {
      stacks$: this.stacks$,
      maximumQuantity: this.authorizedDispatchQuantity - this.currentTransactionQuantity
    };
    this.dialogConfig.formData = {
      ...EMPTY_DISPATCH_TRANSACTION,
      dispatch_authorization_id: this.selectedAuthorizedDispatch.id, 
    };
    DialogService.handleDialog(this.dialogConfig);
  }

}
