import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { HubAuthorization } from '../../models/hub-authorization.model';

export interface HubAuthorizationState extends EntityState<HubAuthorization, number> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'hub-authorizations', resettable: true })
export class HubAuthorizationStore extends EntityStore<HubAuthorizationState> {
    constructor() {
        super();
    }
}
