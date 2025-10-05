import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { ConversionService } from '../../../shared/services/conversion.service';
import { DispatchState, DispatchStore } from './dispatch.store';

@Injectable({ providedIn: 'root' })
export class DispatchQuery extends QueryEntity<DispatchState> {

  constructor(protected store: DispatchStore,
              private conversionService: ConversionService) {
    super(store);
  }

  selectCommodity(): Observable<any> {
    return this.select(state => state.commodity);
  }

  selectCurrentQuantity(maxUnitId: number, conversionFactors: any[]): Observable<number> {
    return this.select(state => this.computeTotalQuantity(maxUnitId, conversionFactors));
  }

  computeTotalQuantity(maxUnitId: number, conversionFactors: any[]) {
    let totalValue = 0;
    for( let dispatch of this.getAll()) {
      totalValue += this.conversionService.convert(conversionFactors, dispatch.unit_id, maxUnitId, dispatch.quantity);
    }
    return totalValue;
  }

}
