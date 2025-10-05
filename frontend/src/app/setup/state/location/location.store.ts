import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Location } from '../../models/location.model';

export interface LocationState extends EntityState<Location> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'locations', resettable: true })
export class LocationStore extends EntityStore<LocationState> {
  constructor() {
    super();
  }

}
