import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { BaseService } from '../../../shared/services/base.service';
import { UtilService } from '../../../shared/services/util.service';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FreespaceReportService {
    constructor(private baseService: BaseService,
                private utilService: UtilService) {}

    get(endpoint: string) {
        const url = `${environment.apiUrl}/${endpoint}`;
        return this.baseService.get(url).pipe(
            tap(({success, error}: any) => {
                    if (!success) {
                        this.utilService.showAPIErrorResponse(error);
                    } 
                }, error => {
                    this.utilService.showAPIErrorResponse(error.error.error);
            })
        );
    }
}
