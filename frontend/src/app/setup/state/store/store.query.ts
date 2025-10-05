import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { Store } from '../../models/store.model';
import { StorekeeperStoresState, StorekeeperStoresStore, StoreState, StoreStore } from './store.store';

@Injectable({ providedIn: 'root' })
export class StoreQuery extends QueryEntity<StoreState> {

  constructor(protected store: StoreStore) {
    super(store);
  }

  get currentUserWarehouse() {
    return this.getValue().currentUserWarehouses;
  }

  selectDefaultStore() {
    return this.selectAll({
      filterBy: entity => entity.id === 1
    })
  }

  selectCurrentUserStores(): Observable<Store[]> {
    return this.select(state => state.currentUserStores);
  }

  selectCurrentUserWarehouses(): Observable<any[]> {
    return this.select(state => state.currentUserWarehouses);
  }

}


@Injectable({ providedIn: 'root' })
export class StorekeeperStoresQuery extends QueryEntity<StorekeeperStoresState> {

  constructor(protected store: StorekeeperStoresStore) {
    super(store);
  }

}
