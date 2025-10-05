import { Injectable } from '@angular/core';
import { applyTransaction } from '@datorama/akita';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../../../shared/services/base.service';
import { UtilService } from '../../../shared/services/util.service';
import { ReceiptTransaction } from '../../models/receipt-transaction.model';
import { ReceiptTransactionQuery } from './receipt-transaction.query';
import { ReceiptTransactionStore } from './receipt-transaction.store';

@Injectable({ providedIn: 'root' })
export class ReceiptTransactionService {
    constructor(private store: ReceiptTransactionStore,
                private baseService: BaseService,
                private utilService: UtilService,
                private query: ReceiptTransactionQuery) {}

    get(receiptId: number) {
        const url = `${environment.apiUrl}/cats_core/receipt_authorizations/${receiptId}/transactions`;
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

    add(receiptTransaction: ReceiptTransaction) {
        const url = `${environment.apiUrl}/cats_core/receipt_transactions`;
        return this.baseService.post(url, { payload: receiptTransaction } ).pipe(
            tap(({success, data, error}: any) => {
                    if (success) {
                        applyTransaction(() => {
                            const total = this.store.getValue().currentTotalQuantity;
                            const { id } = data;
                            if (this.query.hasEntity(id)) {
                                this.store.update(id, data);
                            } else {
                                this.store.add(data);
                            }
                            this.updateCurrentQuantity(total + receiptTransaction.quantity);
                        });
                        this.utilService.showMessage('success', 'Success', 'Receipt transaction added successfully.');
                    } else {
                        this.utilService.showAPIErrorResponse(error);
                    }
                }, error => {
                    this.utilService.showAPIErrorResponse(error.error.error);
            })
        );
    }

    update(id: number, receiptTransaction: ReceiptTransaction) {
        const prevValue = this.store.getValue().entities[id]?.quantity;
        const url = `${environment.apiUrl}/cats_core/receipt_transactions/${id}`;
        return this.baseService.put(url, { payload: receiptTransaction }).pipe(
            tap(({success, data, error}: any) => {
                    if (success) {
                        applyTransaction(() => {
                            this.store.update(id, data);
                            const quantity = this.store.getValue().currentTotalQuantity - prevValue + data.quantity;
                            this.updateCurrentQuantity(quantity);
                          });
                        this.utilService.showMessage('success', 'Success', 'Receipt transaction updated successfully.');
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
        const url = `${environment.apiUrl}/cats_core/receipt_transactions/filter`;
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
