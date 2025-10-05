import { ActiveState, EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';

export interface TransporterState extends EntityState<any>, ActiveState {
}


@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'transporter' })
export class TransporterStore extends EntityStore<TransporterState> {
  constructor() {
    super();
  }
}
