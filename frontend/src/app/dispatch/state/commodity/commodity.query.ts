import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { CommodityState, CommodityStore } from './commodity.store';

@Injectable({ providedIn: 'root' })
export class CommodityQuery extends QueryEntity<CommodityState> {
    constructor(protected store: CommodityStore) {
        super(store);
    }
}
