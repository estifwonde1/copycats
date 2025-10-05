import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { ReceiptAuthorization } from '../../models/receipt-authorization.model';

export interface ReceiptAuthorizationState extends EntityState<ReceiptAuthorization, number> {}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'receipt-authorizations'})
export class ReceiptAuthorizationStore extends EntityStore<ReceiptAuthorizationState> {
    constructor() {
        super();
    }
}
