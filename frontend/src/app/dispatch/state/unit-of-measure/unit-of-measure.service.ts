import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { BaseService } from '../../../shared/services/base.service';
import { UtilService } from '../../../shared/services/util.service';
import { environment } from '../../../../environments/environment';
import { UnitOfMeasureStore } from './unit-of-measure.store';

@Injectable({ providedIn: 'root' })
export class UnitOfMeasureService {
    constructor(private store: UnitOfMeasureStore,
        private baseService: BaseService,
        private utilService: UtilService) {}

    get() {
        const url = `${environment.apiUrl}/cats_core/unit_of_measures`;
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
}
