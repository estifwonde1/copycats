import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { HubAuthorizationState, HubAuthorizationStore } from './hub-authorization.store';

@Injectable({ providedIn: 'root' })
export class HubAuthorizationQuery extends QueryEntity<HubAuthorizationState> {
    constructor(protected store: HubAuthorizationStore) {
        super(store);
    }
}
