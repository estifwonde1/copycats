import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { applyTransaction, ID } from '@datorama/akita';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { UtilService } from '../../../shared/services/util.service';
import { Dispatch } from '../../models/dispatch.model';
import { ReceiptStore } from '../receipt/receipt.store';
import { DispatchStore } from './dispatch.store';

@Injectable({ providedIn: 'root' })
export class DispatchService {

  constructor(private store: DispatchStore, private http: HttpClient,
              private utilService: UtilService, private receiptStore: ReceiptStore) {
  }

  getByDispatchPlanItem(dispatchPlanItemId: number | ID) {
    const url = `${environment.apiUrl}/cats_core/dispatch_plan_items/${dispatchPlanItemId}/dispatches`;
    return this.http.get<Dispatch[]>(url)
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            applyTransaction(() => {
              const total = data.map((d:any) => d.quantity).reduce((prev: number, curr: number) => prev += curr, 0);
              this.store.set(data);
              this.updateCurrentQuantity(total);
            })
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  get(status?: string) {
    const url = `${environment.apiUrl}/cats_core/dispatches/search?status=${status}`;
    return this.http.get<Dispatch[]>(url)
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            this.store.add(data);
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  add(payload: Dispatch) {
    const url = `${environment.apiUrl}/cats_core/dispatches`;
    return this.http.post(url, { payload })
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            applyTransaction(() => {
              const total = this.store.getValue().currentTotalQuantity;
              const { quantity } = data;
              this.store.add(data);
              this.updateCurrentQuantity(total + quantity);
            });
            this.utilService.showMessage('success', 'Success', 'Dispatch registered successfully.');
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  update(id: number, payload: Partial<Dispatch>) {
    const prevValue = this.store.getValue().entities[id]?.quantity;
    const url = `${environment.apiUrl}/cats_core/dispatches/${id}`;
    return this.http.put(url, { payload })
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            applyTransaction(() => {
              this.store.update(id, data);
              const quantity = this.store.getValue().currentTotalQuantity - prevValue + data.quantity;
              this.updateCurrentQuantity(quantity);
            });
            this.utilService.showMessage('success', 'Success', 'Dispatch updated successfully.');
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  confirm(id: number) {
    const url = `${environment.apiUrl}/cats_core/dispatches/${id}/confirm`;
    return this.http.post(url, {})
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            this.store.update(id, data);
            this.utilService.showMessage('success', 'Success', 'Dispatch confirmed successfully.');
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  approve(id: number | ID, payload: Partial<Dispatch>) {
    const url = `${environment.apiUrl}/cats_core/dispatches/${id}/approve`;
    return this.http.post(url, { payload })
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            this.store.update(id, data);
            this.utilService.showMessage('success', 'Success', 'Dispatch approved successfully.');
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  start(id: number | ID, payload: Partial<Dispatch>) {
    const url = `${environment.apiUrl}/cats_core/dispatches/${id}/start`;
    return this.http.post(url, { payload })
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            this.store.update(id, data);
            this.utilService.showMessage('success', 'Success', 'Dispatch updated successfully.');
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  getCommodity(id: number) {
    const url = `${environment.apiUrl}/cats_core/dispatches/${id}/commodity`;
    return this.http.get<any>(url)
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            this.store.update({commodity: data});
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  getOne(id: number) {
    const url = `${environment.apiUrl}/cats_core/dispatches/${id}`;
    return this.http.get(url,{});
  }

  addOneToStore(payload:any) {
      this.store.add(payload);
  }

  updateCurrentQuantity(quantity: number): void {
    this.store.update({currentTotalQuantity: quantity});
  }

  filter(params: any) {
    const url = `${environment.apiUrl}/cats_core/dispatches/filter`;
    return this.http.post(url, { q: params }).pipe(
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

  revert(id: number) {
    const url = `${environment.apiUrl}/cats_core/dispatches/${id}/revert`;
    return this.http.post(url, {})
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            this.store.update(id, {dispatch_status: 'Draft'});
            this.utilService.showMessage('success', 'Success', 'Dispatch updated successfully.');
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
