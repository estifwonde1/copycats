import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { UnitOfMeasureState, UnitOfMeasureStore } from './unit-of-measure.store';

@Injectable({ providedIn: 'root' })
export class UnitOfMeasureQuery extends QueryEntity<UnitOfMeasureState> {
    constructor(protected store: UnitOfMeasureStore) {
        super(store);
    }
}
