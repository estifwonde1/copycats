import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { InventoryAdjustmentState, InventoryAdjustmentStore } from './inventory-adjustment.store';

@Injectable({ providedIn: 'root' })
export class InventoryAdjustmentQuery extends QueryEntity<InventoryAdjustmentState> {
    constructor(protected store: InventoryAdjustmentStore) {
        super(store);
    }
}
