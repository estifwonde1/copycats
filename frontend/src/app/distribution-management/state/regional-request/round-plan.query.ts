import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { RoundPlanState, RoundPlanStore } from './round-plan.store';

@Injectable({ providedIn: 'root' })
export class RoundPlanQuery extends QueryEntity<RoundPlanState> {
    constructor(protected store: RoundPlanStore) {
        super(store);
    }
}
