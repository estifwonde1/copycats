import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Route } from '../../models/route.model';

export interface RouteState extends EntityState<Route, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'routes' })
export class RouteStore extends EntityStore<RouteState> {
    constructor() {
        super();
    }
}
