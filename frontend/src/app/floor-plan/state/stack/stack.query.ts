import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { StackState, StackStore } from './stack.store';

@Injectable({ providedIn: 'root' })
export class StackQuery extends QueryEntity<StackState> {

  constructor(protected store: StackStore) {
    super(store);
  }

  selectCommodities(): Observable<any[]> {
    return this.select(state => state.commodities);
  }

  getAllExcept(stackId: number) {
    return this.selectAll({
      filterBy: (entity) => entity.id !== stackId 
    });
  }
}
