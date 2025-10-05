import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { BaseService } from '../../../shared/services/base.service';
import { UtilService } from '../../../shared/services/util.service';
import { environment } from '../../../../environments/environment';
import { MonthlyPlanStore } from './monthly-plan.store';
import { RoundPlan } from '../../../distribution-management/model/round-plan.model';

@Injectable({ providedIn: 'root' })
export class MonthlyPlanService {
    constructor(private store: MonthlyPlanStore,
                private baseService: BaseService,
                private utilService: UtilService) {}

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

    complete(id: number, payload: Partial<RoundPlan>) {
        const url = `${environment.apiUrl}/cats_core/round_plans/${id}`;
        return this.baseService.put(url, { payload })
          .pipe(
            tap(({success, data, error}: any) => {
              if (success) {
                this.store.remove(id);
                this.utilService.showMessage('success', 'Success', 'Round plan completed successfully.');
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
}
