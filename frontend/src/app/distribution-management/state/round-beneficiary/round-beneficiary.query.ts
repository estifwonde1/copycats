import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { RoundBeneficiaryState, RoundBeneficiaryStore } from './round-beneficiary.store';

@Injectable({ providedIn: 'root'})
export class RoundBeneficiaryQuery extends QueryEntity<RoundBeneficiaryState> {
    constructor(protected store: RoundBeneficiaryStore) {
        super(store);
    }
}
