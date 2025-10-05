import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { StackingRuleState, StackingRuleStore } from './stacking-rule.store';

@Injectable({ providedIn: 'root' })
export class StackingRuleQuery extends QueryEntity<StackingRuleState> {

  constructor(protected store: StackingRuleStore) {
    super(store);
  }
}
