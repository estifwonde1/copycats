import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { ReceiptTransactionState, ReceiptTransactionStore } from './receipt-transaction.store';

@Injectable({ providedIn: 'root' })
export class ReceiptTransactionQuery extends QueryEntity<ReceiptTransactionState> {
    constructor(protected store: ReceiptTransactionStore) {
        super(store);
    }

    selectCurrentQuantity(): Observable<number> {
        return this.select(state => state. currentTotalQuantity);
    }
}
