import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SUPPLIER } from '../../../shared/constants/supplier-dummy-data.constant';
import { LocationState, LocationStore } from './location.store';

@Injectable({ providedIn: 'root' })
export class LocationQuery extends QueryEntity<LocationState> {

  constructor(protected store: LocationStore) {
    super(store);
  }

  selectSourceLocation(): Observable<any[]> {
    return this.select(state => state.sourceLocations);
  }

  selectDestinationLocation(): Observable<any[]> {
    return this.select(state => state.destinationLocations);
  }

  selectByLocationType(locationType: string, parent_id: number = null): Observable<any[]> {
    return this.selectAll({
      filterBy: entity => entity.location_type === locationType && entity.parent_id === parent_id
    }).pipe(map((locations: any[]) => this.filterDummyRegion(locations)));
  }

  filterDummyRegion(locations: any[]): any {
    return locations.filter(({code}: any) => !SUPPLIER.REGION.includes(code))
  }

  selectHubs(): Observable<any[]> {
    return this.selectAll({
      filterBy: entity => entity.location_type === 'Hub'
    }).pipe(map((hubs: any[]) => this.filterDummyHub(hubs)));
  }

  filterDummyHub(hubs: any[]): any {
    return hubs.filter(({code}: any) => !SUPPLIER.HUB.includes(code))
  }

  getByName(pattern: string) {
    return this.selectAll({
        filterBy: ({name}) => name.toLowerCase().includes(pattern.toLowerCase())
    })
  }

}
