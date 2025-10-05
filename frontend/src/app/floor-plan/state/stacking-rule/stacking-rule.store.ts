import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface StackingRuleState extends EntityState<any> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'stacking-rule' })
export class StackingRuleStore extends EntityStore<StackingRuleState> {
  constructor() {
    super();
  }

}
