import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { RoundPlan } from '../../model/round-plan.model';

export interface RoundPlanState extends EntityState<RoundPlan, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'round-plans', resettable: true })
export class RoundPlanStore extends EntityStore<RoundPlanState> {
    constructor() {
        super();
    }
}
