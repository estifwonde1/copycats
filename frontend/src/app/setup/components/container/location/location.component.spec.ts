import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { DialogService } from '../../../../shared/services/dialog.service';
import { UtilService } from '../../../../shared/services/util.service';
import { LOCATION_TYPES } from '../../../constants/location-types';
import { Location } from '../../../models/location.model';
import { OperationService } from '../../../services/operation.service';
import { LocationQuery } from '../../../state/location/location.query';
import { LocationService } from '../../../state/location/location.sevice';

import { LocationComponent } from './location.component';

describe('LocationComponent', () => {
  let component: LocationComponent;
  let fixture: ComponentFixture<LocationComponent>;
  let service: LocationService;
  let operationService: OperationService;
  let utilService: UtilService;
  let query: LocationQuery;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationComponent ],
      imports: [
        MatDialogModule,
        HttpClientTestingModule
      ],
      providers: [
        MessageService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.inject(LocationService);
    utilService = TestBed.inject(UtilService);
    operationService = TestBed.inject(OperationService);
    query = TestBed.inject(LocationQuery);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call setLocationAncestries method', () => {
      const spy = spyOn(component, 'setLocationAncestries');
      component.ngOnInit();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('setLocationAncestries', () => {
    it('should add to allLocationAncestries array', () => {
      component.allLocationAncestries = [];
      component.setLocationAncestries();
      expect(component.allLocationAncestries.length).toEqual(LOCATION_TYPES.length);
    });
  });

  describe('onLocationTypeChange', () => {
    it('should assign selectedLocationType of the component attribute', () => {
      component.selectedLocationType = '';
      component.onLocationTypeChange('Warehouse');
      expect(component.selectedLocationType).toEqual('Warehouse');
    });

    it('should call resetAllPreviousValues', () => {
      const spy = spyOn(component, 'resetAllPreviousValues');
      component.onLocationTypeChange('');
      expect(spy).toHaveBeenCalled();
    });

    it('should call isRegionStoreEmpty method', () => {
      const spy = spyOn(component, 'isRegionStoreEmpty');
      component.onLocationTypeChange('');
      expect(spy).toHaveBeenCalled();
    });

    it('should call changeUIForSelectedLocationType method', () => {
      const spy = spyOn(component, 'changeUIForSelectedLocationType');
      component.onLocationTypeChange('Region');
      expect(spy).toHaveBeenCalledWith('Region');
    });

    it('should call get method of location service', () => {
      const spy = spyOn(service, 'get');
      component.onLocationTypeChange('');
      expect(spy).toHaveBeenCalledWith(utilService.titleCase(LOCATION_TYPES[0]));
    });

    it('should set locations$ array to regions if the selected location type is region', () => {
      const spy = spyOn(query, 'selectByLocationType');
      component.onLocationTypeChange('Region');
      expect(spy).toHaveBeenCalledWith(utilService.titleCase(LOCATION_TYPES[0]));
    });
  });

  describe('changeUIForSelectedLocationType', () => {
    it('should call enableCreateAction', () => {
      const spy = spyOn(component, 'enableCreateAction');
      component.changeUIForSelectedLocationType('');
      expect(spy).toHaveBeenCalled();
    });

    it('should call setCaption method', () => {
      const spy = spyOn(component, 'setCaption');
      component.onLocationTypeChange('Warehouse');
      expect(spy).toHaveBeenCalledWith('Warehouse');
    });
  });

  describe('onRegionChange', () => {
    it('should call resetOtherSelectedValues method with the current region value and index 0', () => {
      component.selectedLocationType = 'Region';
      const spy = spyOn(component, 'resetOtherSelectedValues');
      component.onRegionChange({id: 1});
      expect(spy).toHaveBeenCalledWith({id: 1}, 0);
    });

    it('should set zones options value with zones$ value', () => {
      component.selectedLocationType = 'Region';
      spyOn(component, 'fetchNextAncestry').and.returnValue(of({name: 'zone1', location_type: 'Zone'}));
      const spy = spyOn(operationService, 'setRegionChildren');
      component.onRegionChange({id: 1});
      expect(spy).toHaveBeenCalledWith(component, {id: 1});
    });

    it('should set the parentId if the selected location type is zone', () => {
      component.selectedLocationType = 'Zone';
      component.onRegionChange({id: 1});
      expect(component.parentId).toEqual(1);
    });

    it('should call setLocations method with the selected location type and parent id', () => {
      component.selectedLocationType = 'Zone';
      const spy = spyOn(component, 'setLocations');
      component.onRegionChange({id: 1});
      expect(spy).toHaveBeenCalledWith('Zone', 1);
    });
  });

  describe('enableCreateAction', () => {
    it('should disable create action if no location ancestry selected and parent id is not given', () => {
      component.selectedLocationAncestries = [{value: null}];
      component.selectedLocationType = 'Zone';
      component.enableCreateAction();
      expect(component.actions[0].disabled).toBeTrue();
    });

    it('should enable create action if location ancestry selected and parent id is not neccessary', () => {
      component.selectedLocationAncestries = [{value: 'Test'}];
      component.selectedLocationType = 'Region';
      component.enableCreateAction();
      expect(component.actions[0].disabled).toBeFalse();
    });
  });


  it('should call handleDialog method of dialogService when onCreate call', () => {
    component.selectedLocationType = 'Region';
    const spy = spyOn(DialogService, 'handleDialog');
    component.onCreate();
    expect(spy).toHaveBeenCalledWith(component.dialogConfig);
  });

  it('should call handleDialog method of dialogService when onEdit call', () => {
    component.selectedLocationType = 'Region';
    const spy = spyOn(DialogService, 'handleDialog');
    const location: Location = {id: 1, name: 'Location One', description: 'Sample location', location_type: 'Region'};
    component.onEdit({item: location});
    expect(component.dialogConfig.formData).toEqual(location);
    expect(spy).toHaveBeenCalledWith(component.dialogConfig);
  });

});
