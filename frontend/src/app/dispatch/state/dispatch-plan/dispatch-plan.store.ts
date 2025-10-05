import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface DispatchPlanState extends EntityState<any> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'dispatch-plan', resettable: true })
export class DispatchPlanStore extends EntityStore<DispatchPlanState> {
  constructor() {
    super();
  }

}
