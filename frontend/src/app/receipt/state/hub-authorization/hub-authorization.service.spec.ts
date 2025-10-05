import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BaseService } from '../../../shared/services/base.service';
import { UtilService } from '../../../shared/services/util.service';
import { HubAuthorizationService } from './hub-authorization.service';
import { HubAuthorizationStore } from './hub-authorization.store';
import { HubAuthorization } from '../../models/hub-authorization.model';


describe('HubAuthorizationService', () => {
  let service: HubAuthorizationService;
  let baseService: BaseService;
  let store: HubAuthorizationStore;
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
    service = TestBed.inject(HubAuthorizationService);
    baseService = TestBed.inject(BaseService);
    utilService = TestBed.inject(UtilService);
    store = TestBed.inject(HubAuthorizationStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#get', () => {
    it('should call get method of base service', () => {
      const url = `${environment.apiUrl}/dispatch_plan_items/1/hub_authorizations`;
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
    let payload: HubAuthorization;
    beforeEach(() => {
      payload = {
        id: null,  
        dispatch_plan_item_id: 1,
        type: 'Source Authorization',
        store_id: 1,
        quantity: 20,
      };
    });
    it('should call post method of the base service', () => {
      const url = `${environment.apiUrl}/hub_authorizations`;
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
    let payload: HubAuthorization;
    let id: number;
    beforeEach(() => {
      payload = {
        id: null,  
        dispatch_plan_item_id: 1,
        type: 'Source Authorization',
        store_id: 1,
        quantity: 20,
      };
      id = 1;
    });
    it('should call put method of the base service', () => {
      const url = `${environment.apiUrl}/hub_authorizations/${id}`;
      const spy = spyOn(baseService, 'put').and.returnValue(of({}));
      service.update(id, payload);
      expect(spy).toHaveBeenCalledWith(url, {payload});
    });

    it('should call update method of the store', () => {
      spyOn(baseService, 'put').and.returnValue(of({success: true, data: []}));
      const spy = spyOn(store, 'update');
      service.update(id, payload).subscribe();
      expect(spy).toHaveBeenCalledTimes(id);
    });
  });
});
