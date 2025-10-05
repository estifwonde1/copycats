import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { StackTransactionState, StackTransactionStore } from './stack-transaction.store';

@Injectable({ providedIn: 'root' })
export class StackTransactionQuery extends QueryEntity<StackTransactionState> {
    constructor(protected store: StackTransactionStore) {
        super(store);
    }
}
