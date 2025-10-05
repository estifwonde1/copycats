import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../../../shared/services/base.service';
import { UtilService } from '../../../shared/services/util.service';
import { HubAuthorization } from '../../models/hub-authorization.model';
import { HubAuthorizationStore } from './hub-authorization.store';

@Injectable({ providedIn: 'root' })
export class HubAuthorizationService {
    constructor(private store: HubAuthorizationStore,
                private baseService: BaseService,
                private utilService: UtilService) {}

    get(dispatchPlanItemId: number) {
        const url = `${environment.apiUrl}/dispatch_plan_items/${dispatchPlanItemId}/hub_authorizations`;
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

    add(payload: HubAuthorization) {
        const url = `${environment.apiUrl}/hub_authorizations`;
        return this.baseService.post(url, { payload } ).pipe(
            tap(({success, data, error}: any) => {
                if (success) {
                    this.store.add(data);
                    this.utilService.showMessage('success', 'Success', 'Hub authorization added successfully.');
                } else {
                    this.utilService.showAPIErrorResponse(error);
                }
                }, error => {
                this.utilService.showAPIErrorResponse(error.error.error);
                })
        );
    }

    update(id: number, payload: HubAuthorization) {
        const url = `${environment.apiUrl}/hub_authorizations/${id}`;
        return this.baseService.put(url, { payload }).pipe(
            tap(({success, data, error}: any) => {
                if (success) {
                    this.store.update(id, data);
                    this.utilService.showMessage('success', 'Success', 'Hub authorization updated successfully.');
                } else {
                    this.utilService.showAPIErrorResponse(error);
                }
                }, error => {
                this.utilService.showAPIErrorResponse(error.error.error);
                })
        );
    }

    filter(payload: any) {
        const url = `${environment.apiUrl}/hub_authorizations/filter`;
        return this.baseService.post(url, { q: payload } ).pipe(
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

    reset() {
        this.store.reset();
    }
}
