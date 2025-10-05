import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DispatchPlanItem } from '../../models/dispatch-plan-item.model';
import { DispatchPlanItemState, 
        DispatchPlanItemStore, 
        ProspectiveDispatchPlanItemState, 
        ProspectiveDispatchPlanItemStore } from './dispatch-plan-item.store';

@Injectable({ providedIn: 'root' })
export class DispatchPlanItemQuery extends QueryEntity<DispatchPlanItemState> {

  constructor(protected store: DispatchPlanItemStore) {
    super(store);
  }

  selectCurrentQuantity(): Observable<number> {
    return this.select(state => state.currentTotalDispatchPlanItem);
  }

  selectDispatchPlanItems(): Observable<DispatchPlanItem[]> {
    return this.selectAll().pipe(
      map((items: any) => this.transformDispatchPlanItem(items))
    );
  }

  transformDispatchPlanItem(dispatchPlanItems: DispatchPlanItem[] | undefined) {
    return dispatchPlanItems.map((dpi) => {return {...dpi, reference: `${dpi.source_name}-${dpi.destination_name}`}});
  }
}

@Injectable({ providedIn: 'root'} )
export class ProspectiveDispatchPlanItemQuery extends QueryEntity<ProspectiveDispatchPlanItemState> {
    constructor(protected store: ProspectiveDispatchPlanItemStore) {
        super(store);
    }

    selectByZone(zone: string): any {
      return this.selectAll({
        filterBy: entity => entity.zone === zone
      });
    }

    selectByCommodityCategory(commodityCategory: string) {
      return this.selectAll({
        filterBy: (entity: any) => entity.commodity_category === commodityCategory 
      });
    }

    selectByZoneAndCommodityCategory(zone: string, commodityCategory: string) {
      return this.selectAll({
        filterBy: [
          (entity: any) => entity.zone === zone,
          (entity: any) => entity.commodity_category === commodityCategory
          
        ]
      });
    }
}
