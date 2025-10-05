import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Receipt } from '../../models/receipt.model';

export interface ReceiptState extends EntityState<Receipt> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'receipts', resettable: true })
export class ReceiptStore extends EntityStore<ReceiptState> {
  constructor() {
    super();
  }

}
