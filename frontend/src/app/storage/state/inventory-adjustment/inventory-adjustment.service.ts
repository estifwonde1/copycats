import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../../../shared/services/base.service';
import { UtilService } from '../../../shared/services/util.service';
import { InventoryAdjustment } from '../../models/inventory-adjustment.model';
import { InventoryAdjustmentQuery } from './inventory-adjustment.query';
import { InventoryAdjustmentStore } from './inventory-adjustment.store';

@Injectable({ providedIn: 'root' })
export class InventoryAdjustmentService {
    constructor(private store: InventoryAdjustmentStore,
        private baseService: BaseService,
        private utilService: UtilService,
        private query: InventoryAdjustmentQuery) {}

    add(inventoryAdjustment: InventoryAdjustment) {
        const url = `${environment.apiUrl}/cats_core/inventory_adjustments`;
        return this.baseService.post(url, { payload: inventoryAdjustment } ).pipe(
            tap(({success, data, error}: any) => {
                    if (success) {
                        this.store.add(data);
                        this.utilService.showMessage('success', 'Success', 'Inventory adjustment added successfully.');
                    } else {
                        this.utilService.showAPIErrorResponse(error);
                    }
                }, error => {
                    this.utilService.showAPIErrorResponse(error.error.error);
            })
        );
    }

    update(id: number, inventoryAdjustment: InventoryAdjustment) {
        const url = `${environment.apiUrl}/cats_core/inventory_adjustments/${id}`;
        return this.baseService.put(url, { payload: inventoryAdjustment }).pipe(
            tap(({success, data, error}: any) => {
                    if (success) {
                        this.store.update(id, data)
                        this.utilService.showMessage('success', 'Success', 'Inventory adjustment updated successfully.');
                    } else {
                        this.utilService.showAPIErrorResponse(error);
                    }
                }, error => {
                    this.utilService.showAPIErrorResponse(error.error.error);
            })
        );
    }


    filter(criteria: any) {
        const url = `${environment.apiUrl}/cats_core/inventory_adjustments/filter`;
        return this.baseService.post(url, { q: criteria } ).pipe(
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

    commit(id: number) {
        const url = `${environment.apiUrl}/cats_core/inventory_adjustments/${id}/commit`;
        return this.baseService.post(url, {} ).pipe(
            tap(({success, data, error}: any) => {
                    if (success) {
                        this.store.update(id, data);
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
