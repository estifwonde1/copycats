import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { DispatchPlanItem } from '../../models/dispatch-plan-item.model';

export interface ProspectiveDispatchPlanItemState extends EntityState<any> {}
export interface DispatchPlanItemState extends EntityState<DispatchPlanItem> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'prospective-dispatch-plan-item', resettable: true })
export class ProspectiveDispatchPlanItemStore extends EntityStore<ProspectiveDispatchPlanItemState> {
  constructor() {
    super();
  }

}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'dispatch-plan-item', resettable: true })
export class DispatchPlanItemStore extends EntityStore<DispatchPlanItemState> {
  constructor() {
    super();
  }

}
