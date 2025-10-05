import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { DispatchAuthorization } from '../../models/dispatch-authorization.model';

export interface DispatchAuthorizationState extends EntityState<DispatchAuthorization, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'dispatch-authorization' })
export class DispatchAuthorizationStore extends EntityStore<DispatchAuthorizationState> {
    constructor() {
        super();
    }
}
