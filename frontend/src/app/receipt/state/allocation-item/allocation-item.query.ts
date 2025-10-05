import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { AllocationItemState, AllocationItemStore } from './allocation-item.store';

@Injectable({ providedIn: 'root' })
export class AllocationItemQuery extends QueryEntity<AllocationItemState> {

  constructor(protected store: AllocationItemStore) {
    super(store);
  }

  selectCurrentQuantity(): Observable<number> {
    return this.select(state => state.currentTotalAllocationItem);
  }
}
