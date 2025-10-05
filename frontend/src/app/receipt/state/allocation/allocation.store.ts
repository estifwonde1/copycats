import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { DispatchPlan } from '../../models/dispatch-plan.model';

export interface AllocationState extends EntityState<DispatchPlan> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'allocation', resettable: true })
export class AllocationStore extends EntityStore<AllocationState> {
  constructor() {
    super();
  }
}
