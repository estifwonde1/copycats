import { Injectable } from '@angular/core';
import { NgEntityService } from '@datorama/akita-ng-entity-service';
import { BaseService } from '../../../shared/services/base.service';
import { environment } from '../../../../environments/environment';
import { TransporterState, TransporterStore } from './transporter.store';
import { tap } from 'rxjs/operators';
import { UtilService } from '../../../shared/services/util.service';


@Injectable({ providedIn: 'root' })
export class TransporterService extends NgEntityService<TransporterState> {
  constructor(protected store: TransporterStore,
              private baseService: BaseService,
              private utilService: UtilService) {
    super(store);
  }

  winners(routeId: number) {
    const url = `${environment.apiUrl}/transporters/winner_transporters?route_id=${routeId}`;
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
