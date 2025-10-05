import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface CommodityState extends EntityState<any, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'commodity', resettable: true })
export class CommodityStore extends EntityStore<CommodityState> {
    constructor() {
        super();
    }
}
