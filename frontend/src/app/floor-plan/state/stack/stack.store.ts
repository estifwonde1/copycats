import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';

export interface StackState extends EntityState<any> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'stack' })
export class StackStore extends EntityStore<StackState> {
  constructor() {
    super();
  }

}
