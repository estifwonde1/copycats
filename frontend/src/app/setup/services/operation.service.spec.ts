import { TestBed } from '@angular/core/testing';

import { OperationService } from './operation.service';

const componentStub: any = {
  utilService: {
    titleCase: (word: string): string => {return 'test'}
  },
  query: {
    selectByLocationType: (locationType: string): any => {return [{id:1}]}
  },
  allLocationAncestries: [
    { options: [{}], placeholder: 'Zone' },
    { options: [{}], placeholder: 'Woreda' },
    { options: [{}], placeholder: 'Kebele' },
    { options: [{}], placeholder: 'Fdp' },
    { options: [{}], placeholder: 'Hub' },
    { options: [{}], placeholder: 'Warehouse' },
  ],
  zones$: [],woredas$: [],
  kebeles$: [], hubs$: [], warehouses$: []
};

describe('OperationService', () => {
  let service: OperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#setRegionChildren', () => {
    it('should set zones values', () => {
      const spy = spyOn(componentStub.query, 'selectByLocationType').and.returnValue([{id: 1}]);
      service.setRegionChildren(componentStub, {id: 1});
      const zones = componentStub.allLocationAncestries.filter((ala: any) => ala.placeholder === 'Zone')[0];
      expect(spy).toHaveBeenCalled();
      expect(zones).toEqual(
        {options: [{id: 1}], placeholder: 'Zone'}
      );
    });
  });

  describe('#setZoneChildren', () => {
    it('should set woredas values', () => {
      const spy = spyOn(componentStub.query, 'selectByLocationType').and.returnValue([{id: 1}]);
      service.setZoneChildren(componentStub, {id: 1});
      const woredas = componentStub.allLocationAncestries.filter((ala: any) => ala.placeholder === 'Woreda')[0];
      expect(spy).toHaveBeenCalled();
      expect(woredas).toEqual(
        {options: [{id: 1}], placeholder: 'Woreda'}
      );
    });
  });

  describe('#setWoredaChildren', () => {
    it('should set kebeles values', () => {
      const spy = spyOn(componentStub.query, 'selectByLocationType').and.returnValue([{id: 1}]);
      service.setWoredaChildren(componentStub, {id: 1});
      const kebeles = componentStub.allLocationAncestries.filter((ala: any) => ala.placeholder === 'Kebele')[0];
      expect(spy).toHaveBeenCalled();
      expect(kebeles).toEqual(
        {options: [{id: 1}], placeholder: 'Kebele'}
      );
    });
  });

  describe('#setKebeleChildren', () => {
    it('should set hubs values', () => {
      const spy = spyOn(componentStub.query, 'selectByLocationType').and.returnValue([{id: 1}]);
      service.setKebeleChildren(componentStub, {id: 1});
      const hubs = componentStub.allLocationAncestries.filter((ala: any) => ala.placeholder === 'Hub')[0];
      expect(spy).toHaveBeenCalled();
      expect(hubs).toEqual(
        {options: [{id: 1}], placeholder: 'Hub'}
      );
    });
  });

  describe('#setHubChildren', () => {
    it('should set warehouses values', () => {
      const spy = spyOn(componentStub.query, 'selectByLocationType').and.returnValue([{id: 1}]);
      service.setHubChildren(componentStub, {id: 1});
      const warehouses = componentStub.allLocationAncestries.filter((ala: any) => ala.placeholder === 'Warehouse')[0];
      expect(spy).toHaveBeenCalled();
      expect(warehouses).toEqual(
        {options: [{id: 1}], placeholder: 'Warehouse'}
      );
    });
  });
});

