import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { ReceiptTransactionService } from './receipt-transaction.service';
import { ReceiptTransaction } from '../../models/receipt-transaction.model';

describe('ReceiptTransactionService', () => {
  let service: ReceiptTransactionService;

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
    service = TestBed.inject(ReceiptTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch receipt transactions from server', () => {
    const response = { success: true, data: [{}] };
    const destinationId = 1;
    const spy = spyOn(service, 'get').and.returnValue(of(response));

    service.get(destinationId).subscribe((res: any) => {
      expect(res).toEqual(response);
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should add a new receipt transaction', () => {
    const response = { success: true, data: [{}] };
    const data: ReceiptTransaction = { id: null, receipt_number:'ref01', receipt_id: 1, 
    destination_id: 1, transaction_date: '2021-09-12' } as ReceiptTransaction;
    const spy = spyOn(service, 'add').and.returnValue(of(response));


    service.add(data).subscribe((res: any) => {
      expect(res).toEqual(response);
      expect(spy).toHaveBeenCalledWith(data);
    });
  });

  it('should update a receipt transaction', () => {
    const response = { success: true, data: [{}] };
    const data: ReceiptTransaction = { id: null, receipt_id: 1, receipt_number:'ref01', destination_id: 1, 
    transaction_date: '2021-09-13' } as ReceiptTransaction;
    const spy = spyOn(service, 'update').and.returnValue(of(response));


    service.update(data.id, data).subscribe((res: any) => {
      expect(res).toEqual(response);
      expect(spy).toHaveBeenCalledWith(data.id, data);
    });
  });
});
