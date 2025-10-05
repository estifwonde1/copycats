import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { DispatchTransaction } from '../../models/dispatch-transaction.model';

export interface DispatchTransactionState extends EntityState<DispatchTransaction, number> {};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'dispatch-transaction', resettable: true })
export class DispatchTransactionStore extends EntityStore<DispatchTransactionState> {
    constructor() {
        super();
    }
}
