import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { ReceiptTransaction } from '../../models/receipt-transaction.model';

export interface ReceiptTransactionState extends EntityState<ReceiptTransaction, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'receipt-transactions', resettable: true })
export class ReceiptTransactionStore extends EntityStore<ReceiptTransactionState> {
    constructor() {
        super();
    }
}
