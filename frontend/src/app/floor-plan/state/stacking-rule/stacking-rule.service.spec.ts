import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { StackingRuleService } from './stacking-rule.sevice';

describe('StackingRuleService', () => {
  let service: StackingRuleService;
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
    service = TestBed.inject(StackingRuleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch stacking rules from server', () => {
    const url = `${environment.apiUrl}/stacking_rules`;
    const response = { success: true, data: [{}] };

    service.get().subscribe(res => {
      expect(res).toEqual(response);
    });

    const testReq = httpMock.expectOne(url);
    expect(testReq.request.method).toBe('GET');
    testReq.flush(response);
    httpMock.verify();
  });

});
