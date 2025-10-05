import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { applyTransaction } from '@datorama/akita';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { UtilService } from '../../../shared/services/util.service';
import { Receipt } from '../../models/receipt.model';
import { ReceiptQuery } from './receipt.query';
import { ReceiptStore } from './receipt.store';

@Injectable({ providedIn: 'root' })
export class ReceiptService {

  constructor(private store: ReceiptStore, private http: HttpClient,
              private utilService: UtilService, private query: ReceiptQuery) {
  }

  get(receiptAuthorizationId: number) {
    const url = `${environment.apiUrl}/cats_core/receipt_authorizations/${receiptAuthorizationId}/receipts`;
    return this.http.get<Receipt[]>(url)
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            applyTransaction(() => {
              const total = data.map((d:any) => d.quantity).reduce((prev: number, curr: number) => prev += curr, 0);
              this.store.set(data);
              this.updateCurrentQuantity(total);
            });
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  add(payload: Receipt) {
    const url = `${environment.apiUrl}/cats_core/receipts`;
    return this.http.post(url, { payload })
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            applyTransaction(() => {
              const total = this.store.getValue().currentTotalQuantity;
              const { id } = data;
              if (this.query.hasEntity(id)) {
                this.store.update(id, data);
              } else {
                this.store.add(data);
              }
              this.updateCurrentQuantity(total + payload.quantity);
            });
            this.utilService.showMessage('success', 'Success', 'Receipt registered successfully.');
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  update(id: number, payload: Partial<Receipt>) {
    const prevValue = this.store.getValue().entities[id]?.quantity;
    const url = `${environment.apiUrl}/cats_core/receipts/${id}`;
    return this.http.put(url, { payload })
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            applyTransaction(() => {
              this.store.update(id, data);
              const quantity = this.store.getValue().currentTotalQuantity - prevValue + data.quantity;
              this.updateCurrentQuantity(quantity);
            });
            this.utilService.showMessage('success', 'Success', 'Receipt updated successfully.');
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  start(id: number) {
    const url = `${environment.apiUrl}/cats_core/receipts/${id}/start_stacking`;
    return this.http.post(url, { payload: {} }).pipe(
        tap(({success, data, error}: any) => {
                if (success) {
                    this.store.update(id, data);
                    this.utilService.showMessage('success', 'Success', 'Stacking started.');
                } else {
                  this.utilService.showAPIErrorResponse(error);
                }
            }, error => {
              this.utilService.showAPIErrorResponse(error.error.error);
        })
    );
  }

  complete(id: number) {
    const url = `${environment.apiUrl}/cats_core/receipts/${id}/finish_stacking`;
    return this.http.post(url, { payload: {} }).pipe(
        tap(({success, data, error}: any) => {
                if (success) {
                    this.store.update(id, data);
                    this.utilService.showMessage('success', 'Success', 'Stacking completed.');
                } else {
                  this.utilService.showAPIErrorResponse(error);
                }
            }, error => {
              this.utilService.showAPIErrorResponse(error.error.error);
        })
    );
  }

  updateCurrentQuantity(quantity: number): void {
    this.store.update({currentTotalQuantity: quantity});
  }

  getOne(id: number) {
    const url = `${environment.apiUrl}/cats_core/receipts/${id}`;
    return this.http.get(url,{});
  }

  addOneToStore(payload:any) {
      this.store.add(payload);
  }

  reset(): void {
    this.store.reset();
  }
}
