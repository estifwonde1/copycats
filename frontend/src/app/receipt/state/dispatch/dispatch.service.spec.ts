import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { DispatchService } from './dispatch.sevice';
import { Dispatch } from '../../models/dispatch.model';

describe('DispatchService', () => {
  let service: DispatchService;
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
    service = TestBed.inject(DispatchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch dispatches from server', () => {
    const url = `${environment.apiUrl}/cats_core/dispatches/search?status=Started`;
    const response = { success: true, data: [{}] };

    service.get('Started').subscribe(res => {
      expect(res).toEqual(response);
    });

    const testReq = httpMock.expectOne(url);
    expect(testReq.request.method).toBe('GET');
    testReq.flush(response);
    httpMock.verify();
  });

  it('should confirm dispatch', () => {
    const url = `${environment.apiUrl}/cats_core/dispatches/1/confirm`;
    const response = { success: true, data: [{}] };

    service.confirm(1).subscribe(res => {
      expect(res).toEqual(response);
    });

    const testReq = httpMock.expectOne(url);
    expect(testReq.request.method).toBe('POST');
    testReq.flush(response);
    httpMock.verify();
  });
});
