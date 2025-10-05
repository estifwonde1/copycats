import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface MonthlyPlanState extends EntityState<any, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'monthly-plan', resettable: true })
export class MonthlyPlanStore extends EntityStore<MonthlyPlanState> {
    constructor() {
        super();
    }
}
