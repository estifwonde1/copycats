import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { DispatchPlanItem } from '../../models/dispatch-plan-item.model';

export interface AllocationItemState extends EntityState<DispatchPlanItem> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'allocation-item', resettable: true })
export class AllocationItemStore extends EntityStore<AllocationItemState> {
  constructor() {
    super();
  }

}
