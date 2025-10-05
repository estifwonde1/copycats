import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { DispatchPlanState, DispatchPlanStore } from './dispatch-plan.store';

@Injectable({ providedIn: 'root' })
export class DispatchPlanQuery extends QueryEntity<DispatchPlanState> {

  constructor(protected store: DispatchPlanStore) {
    super(store);
  }

  selectGeneratedDispatchPlanItems(): any {
    return this.select(state => state.generatedDispatchPlanItems);
  }
}
