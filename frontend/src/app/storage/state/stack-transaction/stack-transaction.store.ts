import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { StackTransaction } from '../../models/stack-transaction.model';

export interface StackTransactionState extends EntityState<StackTransaction, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'stack-transactions' })
export class StackTransactionStore extends EntityStore<StackTransactionState> {
    constructor() {
        super();
    }
}
