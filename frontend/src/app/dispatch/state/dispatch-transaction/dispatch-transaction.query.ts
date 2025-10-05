import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { DispatchTransactionState, DispatchTransactionStore } from './dispatch-transaction.store';

@Injectable({ providedIn: 'root'} )
export class DispatchTransactionQuery extends QueryEntity<DispatchTransactionState> {
    constructor(protected store: DispatchTransactionStore) {
        super(store);
    }

    selectCurrentQuantity(): Observable<number> {
        return this.select(state => state. currentTotalQuantity);
    }
}
