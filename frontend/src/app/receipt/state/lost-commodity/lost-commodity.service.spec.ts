import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../../../shared/services/base.service';
import { UtilService } from '../../../shared/services/util.service';
import { LostCommodityService } from './lost-commodity.service';
import { LostCommodityStore } from './lost-commodity.store';
import { LostCommodity } from '../../models/lost-commodity.model';

describe('LostCommodityService', () => {
  let service: LostCommodityService;
  let baseService: BaseService;
  let store: LostCommodityStore;
  let utilService: UtilService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule
      ],
      providers: [
        MessageService,
      ]
    });
    service = TestBed.inject(LostCommodityService);
    baseService = TestBed.inject(BaseService);
    utilService = TestBed.inject(UtilService);
    store = TestBed.inject(LostCommodityStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#get', () => {
    it('should call get method of base service', () => {
      const url = `${environment.apiUrl}/cats_core/receipt_authorizations/1/lost`;
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
  });

  describe('#add', () => {
    let payload: LostCommodity;
    beforeEach(() => {
      payload = {
        id: null,  
        dispatch_id: 1,
        quantity: 10,
        commodity_status: 'Stolen',
        prepared_by_id: 1
      };
    });
    it('should call post method of the base service', () => {
      const url = `${environment.apiUrl}/cats_core/lost_commodities`;
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
  });

  describe('#update', () => {
    let payload: LostCommodity;
    let id: number;
    beforeEach(() => {
      payload = {
        id: null,  
        dispatch_id: 1,
        quantity: 10,
        commodity_status: 'Stolen',
        prepared_by_id: 1
      };
      id = 1;
    });
    it('should call put method of the base service', () => {
      const url = `${environment.apiUrl}/cats_core/lost_commodities/${id}`;
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
  });
});
