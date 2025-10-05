import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { BaseService } from '../../../shared/services/base.service';
import { UtilService } from '../../../shared/services/util.service';
import { environment } from '../../../../environments/environment';
import { ID } from '@datorama/akita';
import { RoundPlanStore } from './round-plan.store';


@Injectable({ providedIn: 'root' })
export class RoundPlanService {
    constructor(private store: RoundPlanStore,
                private baseService: BaseService,
                private utilService: UtilService) {}

    get(planId: ID) {
        const url = `${environment.apiUrl}/cats_core/plans/${planId}/round_plans`;
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

    
    filter(params: any) {
        const url = `${environment.apiUrl}/cats_core/round_plans/filter`;
        return this.baseService.post(url, { q: params }).pipe(
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

    reset(): void {
        this.store.reset();
    }

    getOne(id: number) {
    const url = `${environment.apiUrl}/cats_core/round_plans/${id}`;
    return this.baseService.get(url,{});
    }

    addOneToStore(payload:any) {
    this.store.add(payload);
    }

}
