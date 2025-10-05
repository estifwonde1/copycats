import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../../../shared/services/base.service';
import { of } from 'rxjs';
import { UtilService } from '../../../shared/services/util.service';
import { DispatchPlanItemService } from './dispatch-plan-item.sevice';
import { DispatchPlanItemStore } from './dispatch-plan-item.store';
import { DispatchPlanItem } from '../../models/dispatch-plan-item.model';

describe('DispatchPlanItemService', () => {
  let service: DispatchPlanItemService;
  let baseService: BaseService;
  let store: DispatchPlanItemStore;
  let utilService: UtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
      ],
      providers: [
        MessageService,
      ]
    });
    service = TestBed.inject(DispatchPlanItemService);
    baseService = TestBed.inject(BaseService);
    utilService = TestBed.inject(UtilService);
    store = TestBed.inject(DispatchPlanItemStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#get', () => {
    it('should call get method of base service', () => {
      const url = `${environment.apiUrl}/cats_core/dispatch_plans/1/items`;
      const spy = spyOn(baseService, 'get').and.returnValue(of({}));
      service.get(1);
      expect(spy).toHaveBeenCalledWith(url);
    });

    it('should call set method of the store', () => {
      spyOn(baseService, 'get').and.returnValue(of({success: true, data: []}));
      const spy = spyOn(store, 'set');
      service.get(1).subscribe();
      expect(spy).toHaveBeenCalledWith([]);
    });

    it('should call showErrorMessage method of the util service', () => {
      spyOn(baseService, 'get').and.returnValue(of({success: false, error: ''}));
      const spy = spyOn(utilService, 'showAPIErrorResponse');
      service.get(1).subscribe();
      expect(spy).toHaveBeenCalledWith('');
    });
  });

  describe('#add', () => {
    let payload: DispatchPlanItem;
    beforeEach(() => {
      payload = {
        dispatch_plan_id: 1, destination_id: 1, quantity: 100, source_id: 1, commodity_id: 1
      };
    });
    it('should call post method of the base service', () => {
      const url = `${environment.apiUrl}/cats_core/dispatch_plan_items`;
      const spy = spyOn(baseService, 'post').and.returnValue(of({}));
      service.add(payload);
      expect(spy).toHaveBeenCalledWith(url, {payload});
    });

    it('should call add method of the store', () => {
      spyOn(baseService, 'post').and.returnValue(of({success: true, data: []}));
      const spy = spyOn(store, 'add');
      service.add(payload).subscribe();
      expect(spy).toHaveBeenCalledWith([]);
    });

    it('should call showErrorMessage method of the util service', () => {
      spyOn(baseService, 'post').and.returnValue(of({success: false, error: ''}));
      const spy = spyOn(utilService, 'showAPIErrorResponse');
      service.add(payload).subscribe();
      expect(spy).toHaveBeenCalledWith('');
    });
  });

  describe('#update', () => {
    let payload: DispatchPlanItem;
    let id: number;
    beforeEach(() => {
      payload = {
        dispatch_plan_id: 1, destination_id: 1, quantity: 100, source_id: 1, commodity_id: 1
      };
      id = 1;
    });
    it('should call put method of the base service', () => {
      const url = `${environment.apiUrl}/cats_core/dispatch_plan_items/${id}`;
      const spy = spyOn(baseService, 'put').and.returnValue(of({}));
      service.update(id, payload);
      expect(spy).toHaveBeenCalledWith(url, {payload});
    });

    it('should call update method of the store', () => {
      spyOn(baseService, 'put').and.returnValue(of({success: true, data: []}));
      const spy = spyOn(store, 'update');
      service.update(id, payload).subscribe();
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should call showErrorMessage method of the util service', () => {
      spyOn(baseService, 'put').and.returnValue(of({success: false, error: ''}));
      const spy = spyOn(utilService, 'showAPIErrorResponse');
      service.update(id, payload).subscribe();
      expect(spy).toHaveBeenCalledWith('');
    });
  });
});
