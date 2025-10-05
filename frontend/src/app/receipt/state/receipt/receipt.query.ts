import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { ReceiptState, ReceiptStore } from './receipt.store';

@Injectable({ providedIn: 'root' })
export class ReceiptQuery extends QueryEntity<ReceiptState> {

  constructor(protected store: ReceiptStore) {
    super(store);
  }

  selectCurrentQuantity(): Observable<number> {
    return this.select(state => state. currentTotalQuantity);
  }
}
