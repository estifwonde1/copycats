import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { StoreService } from './store.sevice';
import { Store } from '../../models/store.model';

describe('StoreService', () => {
  let service: StoreService;
  let httpMock: HttpTestingController;

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
    service = TestBed.inject(StoreService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch stores from server', () => {
    const url = `${environment.apiUrl}/cats_core/stores`;
    const response = { success: true, data: [{}] };

    service.get().subscribe(res => {
      expect(res).toEqual(response);
    });

    const testReq = httpMock.expectOne(url);
    expect(testReq.request.method).toBe('GET');
    testReq.flush(response);
    httpMock.verify();
  });

  it('should add store', () => {
    const url = `${environment.apiUrl}/cats_core/stores`;
    const response = { success: true, data: [{}] };
    const payload: Store = {
      id: 1, name: 'Store One', store_keeper_name: 'Abebe', store_keeper_phone: '0923434343',
      width: 200, length: 300, height: 500, has_gangway: false, warehouse_id: 1
    };

    service.add(payload).subscribe(res => {
      expect(res).toEqual(response);
    });

    const testReq = httpMock.expectOne(url);
    expect(testReq.request.method).toBe('POST');
    testReq.flush(response);
    httpMock.verify();
  });

  it('should update store', () => {
    const updatedId = 1;
    const url = `${environment.apiUrl}/cats_core/stores/${updatedId}`;
    const response = { success: true, data: [{}] };
    const payload: Store = {
      id: 1, name: 'Store One', store_keeper_name: 'Abebe', store_keeper_phone: '0923434343',
      width: 200, length: 300, height: 500, has_gangway: false, warehouse_id: 1
    };

    service.update(updatedId, payload).subscribe(res => {
      expect(res).toEqual(response);
    });

    const testReq = httpMock.expectOne(url);
    expect(testReq.request.method).toBe('PUT');
    testReq.flush(response);
    httpMock.verify();
  });

});
