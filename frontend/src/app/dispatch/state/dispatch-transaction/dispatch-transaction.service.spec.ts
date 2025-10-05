import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { DispatchTransactionService } from './dispatch-transaction.service';
import { of } from 'rxjs';
import { DispatchTransaction } from '../../models/dispatch-transaction.model';

describe('DispatchTransactionService', () => {
  let service: DispatchTransactionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule
      ],
      providers: [
        MessageService
      ]
    });
    service = TestBed.inject(DispatchTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch DispatchTransactions from server', () => {
    const response = { success: true, data: [{}] };
    const spy = spyOn(service, 'get').and.returnValue(of(response));

    service.get(1).subscribe((res: any) => {
      expect(res).toEqual(response);
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should fetch add a new dispatch transaction', () => {
    const response = { success: true, data: [{}] };
    const data: DispatchTransaction = { id: null, source_id: 1, 
      dispatch_authorization_id: 1, transaction_date: '23-01-2020', quantity: 100,reference_no:'ref-001'};
    const spy = spyOn(service, 'add').and.returnValue(of(response));


    service.add(data).subscribe((res: any) => {
      expect(res).toEqual(response);
      expect(spy).toHaveBeenCalledWith(data);
    });
  });

  it('should fetch update a dispatch transaction', () => {
    const response = { success: true, data: [{}] };
    const data: DispatchTransaction = { id: null, source_id: 1, 
      dispatch_authorization_id: 1, transaction_date: '23-01-2020', quantity: 100, reference_no:'ref-009' };
    const spy = spyOn(service, 'update').and.returnValue(of(response));


    service.update(data.id, data).subscribe((res: any) => {
      expect(res).toEqual(response);
      expect(spy).toHaveBeenCalledWith(data.id, data);
    });
  });
});
