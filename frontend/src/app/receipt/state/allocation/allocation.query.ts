import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { AllocationState, AllocationStore } from './allocation.store';

@Injectable({ providedIn: 'root' })
export class AllocationQuery extends QueryEntity<AllocationState> {

  constructor(protected store: AllocationStore) {
    super(store);
  }

  selectSourceLocation(): Observable<any[]> {
    return this.select(state => state.sourceLocation);
  }

  selectCurrentQuantity(): Observable<number> {
    return this.select(state => state.currentTotalQuantity);
  }
}
