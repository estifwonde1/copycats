import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { UnitConversion } from '../../models/unit-conversion.model';

export interface UnitConversionState extends EntityState<UnitConversion, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'unit-conversions' })
export class UnitConversionStore extends EntityStore<UnitConversionState> {
    constructor() {
        super();
    }
}
