import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { environment } from '../../../../environments/environment';
import { UnitConversionStore } from './unit-conversion.store';
import { tap } from 'rxjs/operators';
import { UtilService } from '../../../shared/services/util.service';

@Injectable({ providedIn: 'root' })
export class UnitConversionService {
    constructor(private store: UnitConversionStore,
                private baseService: BaseService,
                private utilService: UtilService) {}

    get() {
        const url = `${environment.apiUrl}/cats_core/unit_conversions`;
        return this.baseService.get(url).pipe(
            tap({ 
                next: ({success, data, error}: any) => {
                    if (success) {
                        this.store.set(data);
                    } else {
                        this.utilService.showAPIErrorResponse(error);
                    }
                }, 
                error: error => {
                    this.utilService.showAPIErrorResponse(error.error.error);
                }
            })
        );
    }
}
