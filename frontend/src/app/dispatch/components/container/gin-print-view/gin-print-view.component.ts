import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable } from 'rxjs';
import { DispatchAuthorization } from '../../../../dispatch/models/dispatch-authorization.model';
import { DispatchAuthorizationQuery } from '../../../../dispatch/state/dispatch-authorization/dispatch-authorization.query';
import { DispatchAuthorizationService } from '../../../../dispatch/state/dispatch-authorization/dispatch-authorization.service';
import { Dispatch } from '../../../../receipt/models/dispatch.model';
import { DispatchQuery } from '../../../../receipt/state/dispatch/dispatch.query';
import { DispatchService } from '../../../../receipt/state/dispatch/dispatch.sevice';
import { GinFormComponent } from '../../ui/gin-form/gin-form.component';

@Component({
  selector: 'cats-gin-print-view',
  templateUrl: './gin-print-view.component.html',
  styleUrls: ['./gin-print-view.component.scss']
})
export class GinPrintViewComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  dispatchAuthorizations$: Observable<DispatchAuthorization[]> = 
                                            this.dispatchAuthorizationQuery.filterByStatus('Confirmed');
  dispatches$: Observable<Dispatch[]> = this.dispatchQuery.selectAll();
  selectedDispatch: any;
  selectedDispatchAuthorization: any;

  constructor(private dispatchAuthorizationQuery: DispatchAuthorizationQuery,
              private dispatchAuthorizationService: DispatchAuthorizationService,
              private dispatchQuery: DispatchQuery,
              private dispatchService: DispatchService,
              private dialog: MatDialog,) { }

  ngOnInit(): void {
    this.loadDispatches();
  }

  loadDispatchAuthorizations() {
    this.blockUI.start('Loading...');
    this.dispatchAuthorizationService.get(this.selectedDispatch.id).subscribe(
      (_:any) => this.blockUI.stop(), () => this.blockUI.stop()
    );
  }

  loadDispatches() {
    const criteria = { dispatch_status_in: ['Started', 'Approved'] };
    this.blockUI.start('Loading...');
    this.dispatchService.filter(criteria).subscribe(
      (_:any) => this.blockUI.stop(), () => this.blockUI.stop()
    );
  }

  onDispatchChange() {
    this.loadDispatchAuthorizations();
  }

  onPrintButtonClicked() {
    const dialogRef = this.dialog.open(GinFormComponent, {
      disableClose: true,
      width: '1000px'
    });

    const sub1 = (dialogRef.componentInstance as any).formSubmit.subscribe((data: any) => {
      const payload = {
        ...data, 
        id: this.selectedDispatchAuthorization.id
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

}
