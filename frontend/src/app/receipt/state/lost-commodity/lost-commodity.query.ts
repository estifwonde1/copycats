import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { LostCommodityState, LostCommodityStore } from './lost-commodity.store';

@Injectable({ providedIn: 'root' })
export class LostCommodityQuery extends QueryEntity<LostCommodityState> {
    constructor(protected store: LostCommodityStore) {
        super(store);
    }

    selectCurrentQuantity(): Observable<number> {
        return this.select(state => state. currentTotalQuantity);
    }
}
