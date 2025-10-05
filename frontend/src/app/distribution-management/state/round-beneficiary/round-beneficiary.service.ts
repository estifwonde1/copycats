import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { BaseService } from '../../../shared/services/base.service';
import { UtilService } from '../../../shared/services/util.service';
import { environment } from '../../../../environments/environment';
import { RoundBeneficiaryStore } from './round-beneficiary.store';

@Injectable({providedIn: 'root'})
export class RoundBeneficiaryService {
    constructor(private store: RoundBeneficiaryStore,
        private baseService: BaseService,
        private utilService: UtilService) {}

    get(roundPlanId: number) {
        const url = `${environment.apiUrl}/cats_core/round_plans/${roundPlanId}/beneficiaries`;
        return this.baseService.get(url).pipe(
            tap(({success, data, error}: any) => {
                    if (success) {
                        this.store.set(data);
                    } else {
                        this.utilService.showAPIErrorResponse(error);
                    }
                }, error => {
                    this.utilService.showAPIErrorResponse(error.error.error);
            })
        );
    }

    getByRoundPlanAndFdp(roundPlanId: number, fdpId: number) {
        const url = `${environment.apiUrl}/cats_core/round_beneficiaries/filter`;
        const criteria = { round_plan_item_fdp_id_eq: fdpId,
                           round_plan_item_round_plan_id_eq: roundPlanId };
        return this.baseService.post(url, { q: criteria }).pipe(
            tap(({success, data, error}: any) => {
                    if (success) {
                        this.store.set(data);
                    } else {
                        this.utilService.showAPIErrorResponse(error);
                    }
                }, error => {
                    this.utilService.showAPIErrorResponse(error.error.error);
            })
        );
    }

    confirmReceipt(roundPlanId: number, roundBeneficiaryIds: number[]) {
        const url = `${environment.apiUrl}/cats_core/round_plans/${roundPlanId}/confirm_receipt`;
        return this.baseService.post(url, { ids: roundBeneficiaryIds }).pipe(
            tap(({success, error}: any) => {
                    if (success) {
                        this.store.update(roundBeneficiaryIds, {received: true });
                        this.utilService.showMessage('success', 'Success', 'Receipt confirmed.');
                    } else {
                        this.utilService.showAPIErrorResponse(error);
                    }
                }, error => {
                    this.utilService.showAPIErrorResponse(error.error.error);
            })
        );
    }

    reset() {
        this.store.reset();
    }

}
