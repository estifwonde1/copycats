import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface UnitOfMeasureState extends EntityState<any, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'unit-of-measures' })
export class UnitOfMeasureStore extends EntityStore<UnitOfMeasureState> {
    constructor() {
        super();
    }
}
