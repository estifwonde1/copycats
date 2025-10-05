import { BaseService } from '../../../shared/services/base.service';
import { UtilService } from '../../../shared/services/util.service';
import { environment } from '../../../../environments/environment';
import { DispatchAuthorizationStore } from './dispatch-authorization.store';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { DispatchAuthorization } from '../../models/dispatch-authorization.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class DispatchAuthorizationService {
    constructor(private store: DispatchAuthorizationStore,
                private baseService: BaseService,
                private utilService: UtilService,
                private http: HttpClient) {}

    get(dispatchId: number) {
        const url = `${environment.apiUrl}/cats_core/dispatches/${dispatchId}/dispatch_authorizations`;
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

    getCurrentUserAuthorizations(userId: number): Observable<DispatchAuthorization[]> {
        const url = `${environment.apiUrl}/cats_core/storekeeper/${userId}/dispatch_authorizations`;
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

    add(dispatchAuthorization: DispatchAuthorization) {
        const url = `${environment.apiUrl}/cats_core/dispatch_authorizations`;
        return this.baseService.post(url, { payload: dispatchAuthorization } ).pipe(
            tap(({success, data, error}: any) => {
                    if (success) {
                        this.store.add(data);
                        this.utilService.showMessage('success', 'Success', 'Dispatch authorization added successfully.');
                    } else {
                        this.utilService.showAPIErrorResponse(error);
                    }
                }, error => {
                    this.utilService.showAPIErrorResponse(error.error.error);
            })
        );
    }

    update(id: number, dispatchAuthorization: DispatchAuthorization) {
        const url = `${environment.apiUrl}/cats_core/dispatch_authorizations/${id}`;
        return this.baseService.put(url, { payload: dispatchAuthorization }).pipe(
            tap(({success, data, error}: any) => {
                    if (success) {
                        this.store.update(id, data);
                        this.utilService.showMessage('success', 'Success', 'Dispatch authorization updated successfully.');
                    } else {
                        this.utilService.showAPIErrorResponse(error);
                    }
                }, error => {
                    this.utilService.showAPIErrorResponse(error.error.error);
            })
        );
    }

    confirm(id: number) {
        const url = `${environment.apiUrl}/cats_core/dispatch_authorizations/${id}/confirm`;
        return this.baseService.post(url, {})
          .pipe(
            tap(({success, data, error}: any) => {
              if (success) {
                this.store.update(id, data);
                this.utilService.showMessage('success', 'Success', 'Dispatch authorization confirmed successfully.');
              } else {
                this.utilService.showAPIErrorResponse(error);
              }
            }, error => {
              this.utilService.showAPIErrorResponse(error.error.error);
            })
          );
      }

      downloadGin(payload: any): Observable<any>{
        const url = `${environment.apiUrl}/printables/issue_receipt`;
        return this.http.post(url, {payload}, {responseType: 'blob'});
      }
            
}
