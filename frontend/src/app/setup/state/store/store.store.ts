import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Store } from '../../models/store.model';

export interface StoreState extends EntityState<Store> {}
export interface StorekeeperStoresState extends EntityState<Store> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'store', resettable: true })
export class StoreStore extends EntityStore<StoreState> {
  constructor() {
    super();
  }

}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'storekeeper-stores', resettable: true })
export class StorekeeperStoresStore extends EntityStore<StorekeeperStoresState> {
  constructor() {
    super();
  }

}
