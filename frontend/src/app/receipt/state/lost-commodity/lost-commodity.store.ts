import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { LostCommodity } from '../../models/lost-commodity.model';

export interface LostCommodityState extends EntityState<LostCommodity, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'lost-commodities', resettable: true })
export class LostCommodityStore extends EntityStore<LostCommodityState> {
    constructor() {
        super();
    }
}
