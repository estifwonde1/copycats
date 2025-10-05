import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { MonthlyPlanState, MonthlyPlanStore } from './monthly-plan.store';

@Injectable({ providedIn: 'root' })
export class MonthlyPlanQuery extends QueryEntity<MonthlyPlanState> {
    constructor(protected store: MonthlyPlanStore) {
        super(store);
    }

    selectApprovedMonthlyPlans(): Observable<any[]> {
        return this.selectAll({
            filterBy: rp => rp.status === 'Approved' || rp.status === 'In Progress'
        });
    }
}
