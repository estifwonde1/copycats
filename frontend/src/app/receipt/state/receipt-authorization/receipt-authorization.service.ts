import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { BaseService } from '../../../shared/services/base.service';
import { UtilService } from '../../../shared/services/util.service';
import { environment } from '../../../../environments/environment';
import { ReceiptAuthorization } from '../../models/receipt-authorization.model';
import { ReceiptAuthorizationStore } from './receipt-authorization.store';
import { Observable } from 'rxjs';
import { ReceiptTransactionQuery } from '../../../storage/state/receipt-transaction/receipt-transaction.query';
import { applyTransaction } from '@datorama/akita';
import { ReceiptTransactionStore } from '../../../storage/state/receipt-transaction/receipt-transaction.store';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class ReceiptAuthorizationService {
    constructor(private store: ReceiptAuthorizationStore,
        private baseService: BaseService,
        private utilService: UtilService,
        private receiptTransactionQuery: ReceiptTransactionQuery,
        private receiptTransactionStore: ReceiptTransactionStore,
        private http: HttpClient) {}

    get(dispatchId: number) {
        const url = `${environment.apiUrl}/cats_core/dispatches/${dispatchId}/receipt_authorizations`;
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

    getCurrentUserAuthorizations(userId: number, status='Authorized'): Observable<ReceiptAuthorization[]> {
        const url = `${environment.apiUrl}/cats_core/storekeeper/${userId}/receipt_authorizations?status=${status}`;
        return this.baseService.get(url)
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

    add(receiptAuthorization: ReceiptAuthorization) {
    const url = `${environment.apiUrl}/cats_core/receipt_authorizations`;
    return this.baseService.post(url, { payload: receiptAuthorization } ).pipe(
        tap(({success, data, error}: any) => {
                if (success) {
                    this.store.add(data);
                    this.utilService.showMessage('success', 'Success', 'Receipt authorization added successfully.');
                } else {
                    this.utilService.showAPIErrorResponse(error);
                }
            }, error => {
                this.utilService.showAPIErrorResponse(error.error.error);
        })
    );
    }

    update(id: number, receiptAuthorization: ReceiptAuthorization) {
    const url = `${environment.apiUrl}/cats_core/receipt_authorizations/${id}`;
    return this.baseService.put(url, { payload: receiptAuthorization }).pipe(
        tap(({success, data, error}: any) => {
                if (success) {
                    this.store.update(id, data);
                    this.utilService.showMessage('success', 'Success', 'Receipt authorization updated successfully.');
                } else {
                    this.utilService.showAPIErrorResponse(error);
                }
            }, error => {
                this.utilService.showAPIErrorResponse(error.error.error);
        })
    );
    }

    confirm(id: number) {
        const url = `${environment.apiUrl}/cats_core/receipt_authorizations/${id}/confirm`;
        return this.baseService.post(url, {})
          .pipe(
            tap(({success, data, error}: any) => {
              if (success) {
                this.store.update(id, data);
                this.utilService.showMessage('success', 'Success', 'Receipt authorization confirmed successfully.');
              } else {
                this.utilService.showAPIErrorResponse(error);
              }
            }, error => {
              this.utilService.showAPIErrorResponse(error.error.error);
            })
          );
    }

    driverConfirm(id: number, payload: any) {
      const url = `${environment.apiUrl}/cats_core/receipt_authorizations/${id}/driver_confirm`;
      return this.baseService.post(url, {payload})
        .pipe(
          tap(({success, data, error}: any) => {
            if (success) {
              this.store.update(id, data);
              this.utilService.showMessage('success', 'Success', 'Receipt authorization confirmed successfully.');
            } else {
              this.utilService.showAPIErrorResponse(error);
            }
          }, error => {
            this.utilService.showAPIErrorResponse(error.error.error);
          })
        );
    }

    complete(id: number) {
        const url = `${environment.apiUrl}/cats_core/receipt_authorizations/${id}/stack`;
        return this.baseService.post(url, {})
          .pipe(
            tap(({success, data, error}: any) => {
              if (success) {
                applyTransaction(() => {
                  const receiptTransactionIds = this.receiptTransactionQuery.getAll({
                    filterBy: (receiptTransaction) => receiptTransaction.receipt_authorization_id === data.id
                  }).map(receiptTransaction => receiptTransaction.id);
                  this.receiptTransactionStore.update(receiptTransactionIds, {status: 'Committed'});
                })
                this.utilService.showMessage('success', 'Success', 'Stacking finished successfully.');
              } else {
                this.utilService.showAPIErrorResponse(error);
              }
            }, error => {
              this.utilService.showAPIErrorResponse(error.error.error);
            })
          );
    }

    downloadGrn(payload: any): Observable<any>{
      const url = `${environment.apiUrl}/printables/receiving_receipt`;
      return this.http.post(url, {payload}, {responseType: 'blob'});
    }
}
