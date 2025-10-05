import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../../../shared/services/base.service';
import { UtilService } from '../../../shared/services/util.service';
import { RouteStore } from './route.store';
import { tap } from 'rxjs/operators';
import { Route } from '../../models/route.model';

@Injectable({ providedIn: 'root'})
export class RouteService {
    constructor(private store: RouteStore,
                private baseService: BaseService,
                private utilService: UtilService) {}

    get(regionId: number) {
        const url = `${environment.apiUrl}/cats_core/routes?region_id=${regionId}`;
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

    filter(filteringCriteria: any) {
        const url = `${environment.apiUrl}/cats_core/routes/filter`;
        return this.baseService.post(url, { q: filteringCriteria }).pipe(
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
