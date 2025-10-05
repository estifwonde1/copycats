import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../../../shared/services/base.service';
import { of } from 'rxjs';
import { UtilService } from '../../../shared/services/util.service';
import { DispatchPlanService } from './dispatch-plan.sevice';
import { DispatchPlanStore } from './dispatch-plan.store';
import { DispatchPlan } from '../../models/dispatch-plan.model';

describe('DispatchPlanService', () => {
  let service: DispatchPlanService;
  let baseService: BaseService;
  let store: DispatchPlanStore;
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
    service = TestBed.inject(DispatchPlanService);
    baseService = TestBed.inject(BaseService);
    utilService = TestBed.inject(UtilService);
    store = TestBed.inject(DispatchPlanStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#get', () => {
    it('should call get method of base service', () => {
      const url = `${environment.apiUrl}/cats_core/users/1/plans`;
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

    it('should call showAPIErrorResponse method of the util service', () => {
      spyOn(baseService, 'get').and.returnValue(of({success: false, error: ''}));
      const spy = spyOn(utilService, 'showAPIErrorResponse');
      service.get(1).subscribe();
      expect(spy).toHaveBeenCalledWith('');
    });
  });

  describe('#add', () => {
    let payload: DispatchPlan;
    beforeEach(() => {
      payload = {
        reference_no: '00002'
      };
    });
    it('should call post method of the base service', () => {
      const url = `${environment.apiUrl}/cats_core/dispatch_plans`;
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

    it('should call showAPIErrorResponse method of the util service', () => {
      spyOn(baseService, 'post').and.returnValue(of({success: false, error: ''}));
      const spy = spyOn(utilService, 'showAPIErrorResponse');
      service.add(payload).subscribe();
      expect(spy).toHaveBeenCalledWith('');
    });
  });

  describe('#update', () => {
    let payload: DispatchPlan;
    let id: number;
    beforeEach(() => {
      payload = {
        reference_no: '00002'
      };
      id = 1;
    });
    it('should call put method of the base service', () => {
      const url = `${environment.apiUrl}/cats_core/dispatch_plans/${id}`;
      const spy = spyOn(baseService, 'put').and.returnValue(of({}));
      service.update(id, payload);
      expect(spy).toHaveBeenCalledWith(url, {payload});
    });

    it('should call update method of the store', () => {
      spyOn(baseService, 'put').and.returnValue(of({success: true, data: []}));
      const spy = spyOn(store, 'update');
      service.update(id, payload).subscribe();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call showErrorMessage method of the util service', () => {
      spyOn(baseService, 'put').and.returnValue(of({success: false, error: ''}));
      const spy = spyOn(utilService, 'showAPIErrorResponse');
      service.update(id, payload).subscribe();
      expect(spy).toHaveBeenCalledWith('');
    });
  });

  describe('#post', () => {
    it('should call post method of base service', () => {
      const url = `${environment.apiUrl}/cats_core/dispatch_plans/filter`;
      const spy = spyOn(baseService, 'post').and.returnValue(of({}));
      service.filterByStatus('Approved');
      expect(spy).toHaveBeenCalledWith(url, {q: {status_eq: 'Approved', upstream_eq: false}});
    });

    it('should call set method of the store', () => {
      spyOn(baseService, 'post').and.returnValue(of({success: true, data: []}));
      const spy = spyOn(store, 'set');
      service.filterByStatus('Approved').subscribe();
      expect(spy).toHaveBeenCalledWith([]);
    });

    it('should call showErrorMessage method of the util service', () => {
      spyOn(baseService, 'post').and.returnValue(of({success: false, error: ''}));
      const spy = spyOn(utilService, 'showAPIErrorResponse');
      service.filterByStatus('Approved').subscribe();
      expect(spy).toHaveBeenCalledWith('');
    });
  });
});
