import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { Store } from '../../setup/models/store.model';
import { RectangularPlace } from '../models/rectangular-place.model';

import { OperationService } from './operation.service';

describe('OperationService', () => {
  let service: OperationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule
      ],
      providers: [MessageService]
    });
    service = TestBed.inject(OperationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isOverlapping', () => {
    it('should return true if the two places are overlapping each other', () => {
      const places = [
        {
          left: 10, right: 15, top: 10, bottom: 18
        }
      ];
      const newPlace: RectangularPlace = {
        left: 5, right: 20, top: 10, bottom: 18
      };

      const isOverlapping = service.doOverlapToExistingPlaces(newPlace, places);
      expect(isOverlapping).toBeTrue();
    });
  });


  it('should return false if the stack is not far enough from the wall', () => {
    const place = { left: 10, top: 5, right: 3, bottom: 15};
    const store: Store = {
      name: 'store 1', store_keeper_name: 'Abebe', store_keeper_phone: '092344334', length: 232,
      width: 234, height: 243, has_gangway: false, warehouse_id: 1, id: 1, stacks: []
    };
    expect(service.isFarFromWall(place, 10, store)).toBeFalse();
  });


  it('should return false for isFarFromOtherPlaces method', () => {
    const rectangularPlace = {left: 220, top: 290, right: 420, bottom: 390};
    const places = [
      {left: 220, top: 20, right: 420, bottom: 120},
      {left: 440, top: 20, right: 590, bottom: 480},
      {left: 610, top: 290, right: 1010, bottom: 390}
    ];
    expect(service.isFarFromOtherPlaces(rectangularPlace, 20, places)).toBeTrue();
  });

  describe('doOverlap', () => {
    it('should return true', () => {
      const rect1 = {left: 10, right: 15, top: 10, bottom: 18};
      const rect2 = {left: 5, right: 20, top: 10, bottom: 18};
      expect(service.doOverlap(rect1, rect2)).toBeTrue();
    });
  });

  describe('isFarFromOtherPlaces', () => {
    it('should return true', () => {
      const places = [{left: 10, top: 10, right: 210, bottom: 110}];
      const newPlace = { left: 215, top: 10, right: 420, bottom: 110};
      expect(service.isFarFromOtherPlaces(newPlace, 20, places)).toBeFalse();
    });
  });

  describe('isOverMaximumLength', () => {
    it('should return true', () => {
      const maximumLength = 100;
      const newPlace = { left: 215, top: 10, right: 420, bottom: 110};
      expect(service.isOverMaximumLength(newPlace, maximumLength)).toBeTrue();
    });

    it('should return false', () => {
      const maximumLength = 300;
      const newPlace = { left: 215, top: 10, right: 420, bottom: 110};
      expect(service.isOverMaximumLength(newPlace, maximumLength)).toBeFalse();
    });
  });

  describe('isOverMaximumWidth', () => {
    it('should return true', () => {
      const maximumWidth = 90;
      const newPlace = { left: 215, top: 10, right: 420, bottom: 110};
      expect(service.isOverMaximumWidth(newPlace, maximumWidth)).toBeTrue();
    });

    it('should return false', () => {
      const maximumWidth = 300;
      const newPlace = { left: 215, top: 10, right: 420, bottom: 110};
      expect(service.isOverMaximumWidth(newPlace, maximumWidth)).toBeFalse();
    });
  });
});
