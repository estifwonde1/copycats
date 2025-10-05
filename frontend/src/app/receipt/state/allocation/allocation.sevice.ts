import { Injectable } from '@angular/core';
import { applyTransaction } from '@datorama/akita';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../../../shared/services/base.service';
import { UtilService } from '../../../shared/services/util.service';
import { DispatchPlan } from '../../models/dispatch-plan.model';
import { AllocationStore } from './allocation.store';

@Injectable({ providedIn: 'root' })
export class AllocationService {

  constructor(private store: AllocationStore,
    private service: BaseService, private utilService: UtilService) {
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
            this.store.add(data);
            this.utilService.showMessage('success', 'Success', 'Allocation registered successfully.');
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  update(id: number, payload: Partial<DispatchPlan>) {
    const url = `${environment.apiUrl}/cats_core/dispatch_plans/${id}`;
    return this.service.put(url, { payload })
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            this.store.update(id, data);
            this.utilService.showMessage('success', 'Success', 'Allocation updated successfully.');
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  filterByStatus(status: string) {
    const params: any = { status_eq: status};
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

  getSourceLocations(): Observable<any> {
    return this.service.post(`${environment.apiUrl}/cats_core/locations/filter`, {
      q: { code_eq: 'SUP-Warehouse' }
    }).pipe(
      tap(({success, data, error}: any) => {
        if (success) {
          this.store.update({sourceLocation: data[0]});
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
            this.utilService.showMessage('success', 'Success', 'Allocation approved successfully.');
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

  reset(): void {
    this.store.reset();
  }
}
