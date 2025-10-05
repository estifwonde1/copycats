import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { BaseService } from '../../../shared/services/base.service';
import { UtilService } from '../../../shared/services/util.service';
import { environment } from '../../../../environments/environment';
import { CommodityStore } from './commodity.store';

@Injectable({ providedIn: 'root' })
export class CommodityService {
    constructor(private store: CommodityStore,
                private baseService: BaseService,
                private utilService: UtilService) {}

    filter(params: any) {
        const url = `${environment.apiUrl}/cats_core/commodities/filter`;
        return this.baseService.post(url, { q: params }).pipe(
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

    reset(): void {
        this.store.reset();
    }
}
