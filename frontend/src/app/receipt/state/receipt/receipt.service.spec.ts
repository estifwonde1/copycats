import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { ReceiptService } from './receipt.sevice';
import { Receipt } from '../../models/receipt.model';

describe('ReceiptService', () => {
  let service: ReceiptService;
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
    service = TestBed.inject(ReceiptService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch receipts from server', () => {
    const url = `${environment.apiUrl}/cats_core/receipt_authorizations/1/receipts`;
    const response = { success: true, data: [{}] };

    service.get(1).subscribe(res => {
      expect(res).toEqual(response);
    });

    const testReq = httpMock.expectOne(url);
    expect(testReq.request.method).toBe('GET');
    testReq.flush(response);
    httpMock.verify();
  });

  it('should add receipt', () => {
    const url = `${environment.apiUrl}/cats_core/receipts`;
    const response = { success: true, data: [{}] };
    const payload: Receipt = {
      id: 1, dispatch_id: 1, quantity: 100, prepared_by_id: 1,reference_no:'102992'
    };

    service.add(payload).subscribe(res => {
      expect(res).toEqual(response);
    });

    const testReq = httpMock.expectOne(url);
    expect(testReq.request.method).toBe('POST');
    testReq.flush(response);
    httpMock.verify();
  });

  it('should update receipt', () => {
    const updatedId = 1;
    const url = `${environment.apiUrl}/cats_core/receipts/${updatedId}`;
    const response = { success: true, data: [{}] };
    const payload: Receipt = {
      id: 1, dispatch_id: 1, quantity: 100, prepared_by_id: 1, reference_no:'10092'
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
