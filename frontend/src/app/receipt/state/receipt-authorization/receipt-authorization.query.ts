import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { map } from 'rxjs/operators';
import { ReceiptAuthorization } from '../../models/receipt-authorization.model';
import { ReceiptAuthorizationState, ReceiptAuthorizationStore } from './receipt-authorization.store';

@Injectable({providedIn: 'root'})
export class ReceiptAuthorizationQuery extends QueryEntity<ReceiptAuthorizationState> {
    constructor(protected store: ReceiptAuthorizationStore) {
        super(store);
    }

    selectReceiptAuthorizations(): any {
        return this.selectAll().pipe(map(receiptAuths => this.assignLabel(receiptAuths)))
    }

    selectUnstackedReceiptAuthorization(): any{
        return this.selectAll({
            filterBy: ({dispatch_status}) => dispatch_status !== 'Stacked'
        }).pipe(
            map(receiptAuths => this.assignLabel(receiptAuths))
        );
    }

    assignLabel(receiptAuths: ReceiptAuthorization[]): any {
        return receiptAuths.map(receiptAuth => {
            return {...receiptAuth, label: `${receiptAuth.dispatch_reference_no}-${receiptAuth.store_name}`}
        });
    }

    filterByStatus(desiredStatus: string) {
        return this.selectAll({
            filterBy: ({status}) => status === desiredStatus
        })
    }
}
