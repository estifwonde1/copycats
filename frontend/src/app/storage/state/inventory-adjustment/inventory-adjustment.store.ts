import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { InventoryAdjustment } from '../../models/inventory-adjustment.model';

export interface InventoryAdjustmentState extends EntityState<InventoryAdjustment, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'inventory-adjustments' })
export class InventoryAdjustmentStore extends EntityStore<InventoryAdjustmentState> {
    constructor() {
        super();
    }
}
