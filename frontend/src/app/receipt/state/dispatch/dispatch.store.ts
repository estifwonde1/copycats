import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Dispatch } from '../../models/dispatch.model';

export interface DispatchState extends EntityState<Dispatch> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'dispatches', resettable: true })
export class DispatchStore extends EntityStore<DispatchState> {
  constructor() {
    super();
  }

}
