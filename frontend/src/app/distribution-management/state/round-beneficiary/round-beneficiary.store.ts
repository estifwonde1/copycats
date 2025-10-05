import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { RoundBeneficiary } from '../../model/round-beneficiary.model';

export interface RoundBeneficiaryState extends EntityState<RoundBeneficiary, number> {}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'round-beneficiaries', resettable: true})
export class RoundBeneficiaryStore extends EntityStore<RoundBeneficiaryState> {
    constructor() {
        super();
    }
}
