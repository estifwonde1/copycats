import { Injectable } from '@angular/core';
import { applyTransaction } from '@datorama/akita';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../../../shared/services/base.service';
import { UtilService } from '../../../shared/services/util.service';
import { DispatchPlan } from '../../models/dispatch-plan.model';
import { MonthlyPlanStore } from '../monthly-plan/monthly-plan.store';
import { DispatchPlanStore } from './dispatch-plan.store';
import * as _ from 'lodash';
import { ProspectiveDispatchPlanItemStore } from '../dispatch-plan-item/dispatch-plan-item.store';
import { ProspectiveDispatchPlanItemQuery } from '../dispatch-plan-item/dispatch-plan-item.query';

@Injectable({ providedIn: 'root' })
export class DispatchPlanService {

  constructor(private store: DispatchPlanStore,
    private service: BaseService, private utilService: UtilService, 
    private monthlyPlanStore: MonthlyPlanStore,
    private prospectiveDispatchPlanItemStore: ProspectiveDispatchPlanItemStore,
    private prospectiveDispatchPlanItemQuery: ProspectiveDispatchPlanItemQuery) {
  }

  get(userId: number) {
    const url = `${environment.apiUrl}/cats_core/users/${userId}/plans`;
    return this.service.get(url)
      .pipe(
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

  add(payload: DispatchPlan) {
    const url = `${environment.apiUrl}/cats_core/dispatch_plans`;
    return this.service.post(url, {payload})
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            applyTransaction(() => {
              this.store.add(data);
              const {dispatchable_id} = data;
              this.monthlyPlanStore.update(dispatchable_id, {status: 'Reserved'})
              this.utilService.showMessage('success', 'Success', 'Dispatch plan registered successfully.');
            });
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  bulkCreate(payload: any) {
    const url = `${environment.apiUrl}/cats_core/dispatch_plans/bulk_create`;
    return this.service.post(url, {payload})
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            applyTransaction(() => {
              this.store.add(data);
              const {dispatchable_id} = data;
              this.monthlyPlanStore.update(dispatchable_id, {status: 'Reserved'})
              this.utilService.showMessage('success', 'Success', 'Dispatch plan registered successfully.');
            });
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  generate(roundPlanId: any) {
    const url = `${environment.apiUrl}/cats_core/round_plans/${roundPlanId}/generate_dispatch_plan`;
    return this.service.post(url, {})
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            // generated dispatch plan items with uniqu generated id
            const items = data.items.map((item:any) => {return {...item, id: +_.uniqueId()}});
            this.prospectiveDispatchPlanItemStore.set(items);
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      )
  }

  apply(items: number[], payload: any) {
    const referenceNumberCount =
     this.prospectiveDispatchPlanItemQuery.getCount(({reference_no}) => reference_no === payload.reference_no);

    let canUpdate = true;
    if (referenceNumberCount > 0) {
      canUpdate = this.checkRequisitionNumberForUpdate(payload.reference_no, items);
    }    
    const zoneAndCommodityCheck = this.checkZoneAndCommodityCategory(items);
    if((referenceNumberCount === 0 || canUpdate) && zoneAndCommodityCheck) {
      this.prospectiveDispatchPlanItemStore.update(items, payload);
    } else if(!zoneAndCommodityCheck) {
      this.utilService.showMessage('error', 'Error', 'There is different zone or commodity category');
    } else if(referenceNumberCount > 0) {
      this.utilService.showMessage('error', 'Error', 'There is duplicate reference number');
    }
  }

  checkZoneAndCommodityCategory(items: number[]) {
    let sameZoneAndCommodityCategory = true;
    let emptyZoneAndCommodityCategory = { zone: -1, commodity_category: '' };
    this.prospectiveDispatchPlanItemQuery.selectMany(items).subscribe((data: any) => {
      for(const item of data) {
        if(emptyZoneAndCommodityCategory.zone === -1) {
          emptyZoneAndCommodityCategory.zone = item.zone;
          emptyZoneAndCommodityCategory.commodity_category = item.commodity_category;
        } else if(emptyZoneAndCommodityCategory.zone !== item.zone ||
           emptyZoneAndCommodityCategory.commodity_category !== item.commodity_category) {
             sameZoneAndCommodityCategory = false;
             break;
          }
      }
    });
    return sameZoneAndCommodityCategory;
  }

  checkRequisitionNumberForUpdate(refNumber: any, items: number[]) {
    let areAllSimilar = true;
    this.prospectiveDispatchPlanItemQuery.selectAll({ filterBy: ({reference_no}) => reference_no === refNumber})
    .subscribe((dpis: any) => {
      this.prospectiveDispatchPlanItemQuery.selectMany(items).subscribe((data: any) => {
        for(const item of data) {
          if(item.zone !== dpis[0].zone || item.commodity_category !== dpis[0].commodity_category) {
            areAllSimilar = false
          }
        }
      });
    });
    return areAllSimilar;
  }

  update(id: number, payload: Partial<DispatchPlan>) {
    const url = `${environment.apiUrl}/cats_core/dispatch_plans/${id}`;
    return this.service.put(url, { payload })
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            this.store.update(id, data);
            this.utilService.showMessage('success', 'Success', 'Dispatch plan updated successfully.');
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  approve(id: number) {
    const url = `${environment.apiUrl}/cats_core/dispatch_plans/${id}/approve`;
    return this.service.post(url, {})
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            this.store.update(id, data);
            this.utilService.showMessage('success', 'Success', 'Dispatch plan approved successfully.');
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  filterByStatus(status: string, upstream=false) {
    // In this module we always need downstream dispatch plans, that's why we pass upstream parameter with false value in params variable.
    const params: any = { status_eq: status, upstream_eq: upstream ? null : upstream};
    const url = `${environment.apiUrl}/cats_core/dispatch_plans/filter`;
    return this.service.post(url, { q: params }).pipe(
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

 filterByLocation(locationType: string, locationId: number) {
  const url = `${environment.apiUrl}/cats_core/dispatch_plans/filter_by_location`;
  return this.service.post(url, { location_id: locationId, location_type: locationType }).pipe(
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
 
  getOne(id: number) {
    const url = `${environment.apiUrl}/cats_core/dispatch_plans/${id}`;
    return this.service.get(url,{});
  }

  addOneToStore(payload:any) {
    this.store.add(payload);
  }

  filter(criteria: any) {
    const url = `${environment.apiUrl}/cats_core/dispatch_plans/filter`;
    return this.service.post(url, {q: criteria}).pipe(
      tap({
        next: (result: any) => { 
          let data: any[] = [];
          let ids: any[] = [];
          for(let r of result.data) {
            if(!ids.includes(r.id)) {
              data.push(r);
              ids.push(r.id);
            }
          }
          this.store.set(data);
         },
        error: (err: any) => this.utilService.showAPIErrorResponse(err.error.error)
      })
    )
  }

  reset(): void {
    this.store.reset();
  }
}
