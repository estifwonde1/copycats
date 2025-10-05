import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { applyTransaction } from '@datorama/akita';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../../../shared/services/base.service';
import { UtilService } from '../../../shared/services/util.service';
import { DispatchPlanItem } from '../../models/dispatch-plan-item.model';
import { DispatchPlanItemStore } from './dispatch-plan-item.store';

@Injectable({ providedIn: 'root' })
export class DispatchPlanItemService {

  constructor(private store: DispatchPlanItemStore,
    private service: BaseService, private utilService: UtilService,
    private http: HttpClient) {
  }

  get(dispatchPlanId: number) {
    const url = `${environment.apiUrl}/cats_core/dispatch_plans/${dispatchPlanId}/items`;
    return this.service.get(url)
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            applyTransaction(() => {
              const total = data.map((d:any) => d.quantity).reduce((prev: number, curr: number) => prev += curr, 0);
              this.store.set(data);
              this.updateDispatchPlanItemQuantity(total);
            });
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  add(payload: DispatchPlanItem) {
    const url = `${environment.apiUrl}/cats_core/dispatch_plan_items`;
    return this.service.post(url, {payload})
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            applyTransaction(() => {
              const total = this.store.getValue().currentTotalDispatchPlanItem;
              const { quantity } = data;
              this.store.add(data);
              this.updateDispatchPlanItemQuantity(total + quantity);
            })
            this.utilService.showMessage('success', 'Success', 'Dispatch Plan Item registered successfully.');
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  update(id: number, payload: Partial<DispatchPlanItem>) {
    const prevValue = this.store.getValue().entities[id]?.quantity;
    const url = `${environment.apiUrl}/cats_core/dispatch_plan_items/${id}`;
    return this.service.put(url, { payload })
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            applyTransaction(() => {
              this.store.update(id, data);
              const quantity = this.store.getValue().currentTotalDispatchPlanItem - prevValue + data.quantity;
              this.updateDispatchPlanItemQuantity(quantity);
            });
            this.utilService.showMessage('success', 'Success', 'Dispatch Plan Item updated successfully.');
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  updateDispatchPlanItemQuantity(quantity: number): void {
    this.store.update({currentTotalDispatchPlanItem: quantity});
  }

  getOne(id: number) {
    const url = `${environment.apiUrl}/cats_core/dispatch_plan_items/${id}`;
    return this.service.get(url,{});
  }

  addOneToStore(payload:any) {
    this.store.add(payload);
  }

  reset(): void {
    this.store.reset();
  }

  filter(params: any) {
    const url = `${environment.apiUrl}/cats_core/dispatch_plan_items/filter`;
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

  downloadHubAuthorization(payload: any): Observable<any>{
    const url = `${environment.apiUrl}/printables/hub_authorization`;
    return this.http.post(url, {payload}, {responseType: 'blob'});
  }
}
