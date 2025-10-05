import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { map } from 'rxjs/operators';
import { DispatchAuthorization } from '../../models/dispatch-authorization.model';
import { DispatchAuthorizationState, DispatchAuthorizationStore} from './dispatch-authorization.store';

@Injectable({ providedIn: 'root' })
export class DispatchAuthorizationQuery extends QueryEntity<DispatchAuthorizationState> {
    constructor(protected store: DispatchAuthorizationStore) {
        super(store);
    }

    selectDispatchAuthorizations(): any {
        return this.selectAll().pipe(map(dispatchAuths => this.assignLabel(dispatchAuths)))
    }

    assignLabel(dispatchAuths: DispatchAuthorization[]): any {
        return dispatchAuths.map(dispatchAuth => {
            return {...dispatchAuth, label: `${dispatchAuth.dispatch_reference_no}-${dispatchAuth.store_name}`}
        });
    }

    filterByStatus(desiredStatus: string) {
        return this.selectAll({
            filterBy: ({status}) => status === desiredStatus
        });
    }
}
