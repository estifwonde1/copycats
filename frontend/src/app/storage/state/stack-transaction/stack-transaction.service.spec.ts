import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';

import { StackTransactionService } from './stack-transaction.service';

describe('StackTransactionService', () => {
  let service: StackTransactionService;

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
    service = TestBed.inject(StackTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
