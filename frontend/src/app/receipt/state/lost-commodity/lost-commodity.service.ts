import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { BaseService } from '../../../shared/services/base.service';
import { UtilService } from '../../../shared/services/util.service';
import { environment } from '../../../../environments/environment';
import { LostCommodity } from '../../models/lost-commodity.model';
import { LostCommodityStore } from './lost-commodity.store';
import { applyTransaction } from '@datorama/akita';

@Injectable({ providedIn: 'root' })
export class LostCommodityService {
    constructor(private store: LostCommodityStore,
        private baseService: BaseService,
        private utilService: UtilService) {}

    get(dispatchId: number) {
        const url = `${environment.apiUrl}/cats_core/receipt_authorizations/${dispatchId}/lost`;
        return this.baseService.get(url).pipe(
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

    add(payload: LostCommodity) {
        const url = `${environment.apiUrl}/cats_core/lost_commodities`;
        return this.baseService.post(url, { payload } ).pipe(
            tap(({success, data, error}: any) => {
                if (success) {
                    const total = this.store.getValue().currentTotalQuantity;
                    applyTransaction(() => {
                        this.updateCurrentQuantity(total + payload.quantity);
                        this.store.add(data);
                    });
                    this.utilService.showMessage('success', 'Success', 'Lost commodity added successfully.');
                } else {
                this.utilService.showAPIErrorResponse(error);
                }
            }, error => {
                this.utilService.showAPIErrorResponse(error.error.error);
            })
        );
    }

    update(id: number, payload: LostCommodity) {
        const prevValue = this.store.getValue().entities[id]?.quantity;
        const url = `${environment.apiUrl}/cats_core/lost_commodities/${id}`;
        return this.baseService.put(url, { payload }).pipe(
            tap(({success, data, error}: any) => {
                if (success) {
                    applyTransaction(() => {
                        this.store.update(id, data);
                        const quantity = this.store.getValue().currentTotalQuantity - prevValue + data.quantity;
                        this.updateCurrentQuantity(quantity);
                      });
                    this.utilService.showMessage('success', 'Success', 'Lost commodity updated successfully.');
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
}
