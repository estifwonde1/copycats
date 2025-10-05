import { Injectable } from '@angular/core';
import { LOCATION_TYPES_OBJ } from '../constants/location-types';

@Injectable({
  providedIn: 'root'
})
export class OperationService {

  constructor() { }

  getLocationAncestry(allLocationAncestries: any, type: string): any {
    return allLocationAncestries.filter((ala: any) => ala.placeholder === type)[0];
  }

  setRegionChildren(component: any, value: any): void {
    const {ZONE} = LOCATION_TYPES_OBJ;
    let {zones$, query, utilService, allLocationAncestries} = component;
    zones$ = query.selectByLocationType(utilService.titleCase(ZONE), value.id); 
    this.getLocationAncestry(allLocationAncestries, ZONE).options = zones$;
    this.setZoneChildren(component, value);
  }

  setZoneChildren(component: any, value: any): void {
    let {woredas$, query, utilService, allLocationAncestries } = component;
    const { WOREDA } = LOCATION_TYPES_OBJ;
    woredas$ = query.selectByLocationType(utilService.titleCase(WOREDA), value.id);
    this.getLocationAncestry(allLocationAncestries, WOREDA).options = woredas$;
    this.setWoredaChildren(component, value);
  }

  setWoredaChildren(component: any, value: any): void {
    let {kebeles$, fdps$, query, utilService, allLocationAncestries } = component;
    const { KEBELE, FDP } = LOCATION_TYPES_OBJ;
    kebeles$ = query.selectByLocationType(utilService.titleCase(KEBELE), value.id);
    fdps$ = query.selectByLocationType(utilService.titleCase(FDP), value.id);
    this.getLocationAncestry(allLocationAncestries, KEBELE).options = kebeles$;
    this.getLocationAncestry(allLocationAncestries, FDP).options = fdps$;
    this.setKebeleChildren(component, value);
  }

  setKebeleChildren(component: any, value: any): void {
    let {hubs$, query, utilService, allLocationAncestries } = component;
    const { HUB } = LOCATION_TYPES_OBJ;
    hubs$ = query.selectByLocationType(utilService.titleCase(HUB), value.id);
    this.getLocationAncestry(allLocationAncestries, HUB).options = hubs$;
    this.setHubChildren(component, value);
  }

  setHubChildren(component: any, value: any): void {
    let {warehouses$, query, utilService, allLocationAncestries } = component;
    const { WAREHOUSE } = LOCATION_TYPES_OBJ;
    warehouses$ = query.selectByLocationType(utilService.titleCase(WAREHOUSE), value.id);
    this.getLocationAncestry(allLocationAncestries, WAREHOUSE).options = warehouses$;
  }
  
}
