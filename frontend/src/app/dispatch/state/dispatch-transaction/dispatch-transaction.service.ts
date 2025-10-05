import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { BaseService } from '../../../shared/services/base.service';
import { UtilService } from '../../../shared/services/util.service';
import { environment } from '../../../../environments/environment';
import { DispatchTransactionStore } from './dispatch-transaction.store';
import { DispatchTransaction } from '../../models/dispatch-transaction.model';
import { applyTransaction } from '@datorama/akita';
import { DispatchTransactionQuery } from './dispatch-transaction.query';

@Injectable({
    providedIn: 'root'
})
export class DispatchTransactionService {
    constructor(private store: DispatchTransactionStore,
                private baseService: BaseService,
                private utilService: UtilService,
                private query: DispatchTransactionQuery) {}

    get(dispatchId: number) {
        const url = `${environment.apiUrl}/cats_core/dispatch_authorizations/${dispatchId}/transactions`;
        return this.baseService.get(url).pipe(
            tap(({success, data, error}: any) => {
                if (success) {
                  applyTransaction(() => {
                    const total = data.map((d:any) => d.quantity).reduce((prev: number, curr: number) => prev += curr, 0);
                    this.store.set(data);
                    this.updateCurrentQuantity(total);
                  });
                } else {
                  this.utilService.showAPIErrorResponse(error);
                }
              }, error => {
                this.utilService.showAPIErrorResponse(error.error.error);
            })
        );
    }

    add(dispatchTransaction: DispatchTransaction) {
        const url = `${environment.apiUrl}/cats_core/dispatch_transactions`;
        return this.baseService.post(url, { payload: dispatchTransaction } ).pipe(
            tap(({success, data, error}: any) => {
                if (success) {
                  applyTransaction(() => {
                    this.store.add(data);
                    const total = this.store.getValue().currentTotalQuantity;
                    const { id } = data;
                    if (this.query.hasEntity(id)) {
                      this.store.update(id, data);
                    } else {
                      this.store.add(data);
                    }
                    this.updateCurrentQuantity(total + dispatchTransaction.quantity);
                  });
                  this.utilService.showMessage('success', 'Success', 'Dispatch transaction added successfully.');
                } else {
                  this.utilService.showAPIErrorResponse(error);
                }
              }, error => {
                this.utilService.showAPIErrorResponse(error.error.error);
              })
        );
    }

    update(id: number, dispatchTransaction: DispatchTransaction) {
        const prevValue = this.store.getValue().entities[id]?.quantity;
        const url = `${environment.apiUrl}/cats_core/dispatch_transactions/${id}`;
        return this.baseService.put(url, { payload: dispatchTransaction }).pipe(
            tap(({success, data, error}: any) => {
                if (success) {
                  applyTransaction(() => {
                    this.store.update(id, data);
                    const quantity = this.store.getValue().currentTotalQuantity - prevValue + data.quantity;
                    this.updateCurrentQuantity(quantity);
                  });
                  this.utilService.showMessage('success', 'Success', 'Dispatch transaction updated successfully.');
                } else {
                  this.utilService.showAPIErrorResponse(error);
                }
              }, error => {
                this.utilService.showAPIErrorResponse(error.error.error);
              })
        );
    }

    updateCurrentQuantity(quantity: number): void {
      this.store.update({currentTotalQuantity: quantity});
    }

    filter(criteria: any) {
      const url = `${environment.apiUrl}/cats_core/dispatch_transactions/filter`;
      return this.baseService.post(url, { q: criteria } ).pipe(
          tap(({success, data, error}: any) => {
                  if (success) {
                      this.store.set(data);
                  } else {
                      this.utilService.showAPIErrorResponse(error);
                  }
              }, error => {
                  this.utilService.showAPIErrorResponse(error.error.error);
          })
      );
    }

    reset() {
      this.store.reset();
    }
}
