import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { TransporterState, TransporterStore } from './transporter.store';

@Injectable({ providedIn: 'root' })
export class TransporterQuery extends QueryEntity<TransporterState> {
  constructor(protected store: TransporterStore) {
    super(store);
  }
}
