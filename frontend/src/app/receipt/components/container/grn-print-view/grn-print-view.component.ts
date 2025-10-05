import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable } from 'rxjs';
import { Dispatch } from '../../../../receipt/models/dispatch.model';
import { ReceiptAuthorization } from '../../../../receipt/models/receipt-authorization.model';
import { DispatchQuery } from '../../../../receipt/state/dispatch/dispatch.query';
import { DispatchService } from '../../../../receipt/state/dispatch/dispatch.sevice';
import { ReceiptAuthorizationQuery }
 from '../../../../receipt/state/receipt-authorization/receipt-authorization.query';
import { ReceiptAuthorizationService }
 from '../../../../receipt/state/receipt-authorization/receipt-authorization.service';
import { GrnFormComponent } from '../../ui/grn-form/grn-form.component';

@Component({
  selector: 'cats-grn-print-view',
  templateUrl: './grn-print-view.component.html',
  styleUrls: ['./grn-print-view.component.scss']
})
export class GrnPrintViewComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  receiptAuthorizations$: Observable<ReceiptAuthorization[]> = 
                                            this.receiptAuthorizationQuery.filterByStatus('Confirmed');
  dispatches$: Observable<Dispatch[]> = this.dispatchQuery.selectAll();
  selectedDispatch: any;
  selectedReceiptAuthorization: any;

  constructor(private receiptAuthorizationQuery: ReceiptAuthorizationQuery,
              private receiptAuthorizationService: ReceiptAuthorizationService,
              private dispatchQuery: DispatchQuery,
              private dispatchService: DispatchService,
              private dialog: MatDialog,) { }

  ngOnInit(): void {
    this.loadDispatches();
  }

  loadReceiptAuthorizations() {
    this.blockUI.start('Loading...');
    this.receiptAuthorizationService.get(this.selectedDispatch.id).subscribe(
      (_:any) => this.blockUI.stop(), () => this.blockUI.stop()
    );
  }

  loadDispatches() {
    const criteria = { dispatch_status_in: ['Started', 'Received', 'Stacked'] };
    this.blockUI.start('Loading...');
    this.dispatchService.filter(criteria).subscribe(
      (_:any) => this.blockUI.stop(), () => this.blockUI.stop()
    );
  }

  onDispatchChange() {
    this.loadReceiptAuthorizations();
  }

  onPrintButtonClicked() {
    const dialogRef = this.dialog.open(GrnFormComponent, {
      disableClose: true,
      width: '500px'
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

}
