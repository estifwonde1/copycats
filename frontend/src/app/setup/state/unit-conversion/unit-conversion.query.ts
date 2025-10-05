import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { UnitConversionState, UnitConversionStore } from './unit-conversion.store';

@Injectable({ providedIn: 'root' })
export class UnitConversionQuery extends QueryEntity<UnitConversionState> {
    constructor(protected store: UnitConversionStore) {
        super(store);
    }
}
