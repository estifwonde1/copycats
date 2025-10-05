import { Injectable } from '@angular/core';
import { applyTransaction } from '@datorama/akita';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../../../shared/services/base.service';
import { UtilService } from '../../../shared/services/util.service';
import { DispatchPlanItem } from '../../models/dispatch-plan-item.model';
import { AllocationItemStore } from './allocation-item.store';

@Injectable({ providedIn: 'root' })
export class AllocationItemService {

  constructor(private store: AllocationItemStore,
    private service: BaseService, private utilService: UtilService) {
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
              this.updateAllocationItemQuantity(total);
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
              const total = this.store.getValue().currentTotalAllocationItem;
              const { quantity } = data;
              this.store.add(data);
              this.updateAllocationItemQuantity(total + quantity);
            })
            this.utilService.showMessage('success', 'Success', 'Allocation Item registered successfully.');
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
              const quantity = this.store.getValue().currentTotalAllocationItem - prevValue + data.quantity;
              this.updateAllocationItemQuantity(quantity);
            });
            this.utilService.showMessage('success', 'Success', 'Allocation Item updated successfully.');
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  updateAllocationItemQuantity(quantity: number): void {
    this.store.update({currentTotalAllocationItem: quantity});
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

  authorize(id: number, payload: any) {
    const url = `${environment.apiUrl}/cats_core/dispatch_plan_items/${id}`;
    return this.service.put(url, { payload }).pipe(
      tap(({success, data, error}: any) => {
            if (success) {
                this.store.update(id, data);
                this.utilService.showMessage('success', 'Success', 'Authorized successfully.');
            } else {
                this.utilService.showAPIErrorResponse(error);
            }
          }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
    );
  }

  filter(payload: any) {
    const url = `${environment.apiUrl}/cats_core/dispatch_plan_items/filter`;
    return this.service.post(url, { q: payload } ).pipe(
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
}
