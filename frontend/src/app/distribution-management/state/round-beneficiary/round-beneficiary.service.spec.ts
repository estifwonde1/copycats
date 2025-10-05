import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { RoundBeneficiaryService } from './round-beneficiary.service';

describe('RoundBeneficiaryService', () => {
  let service: RoundBeneficiaryService;

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
    service = TestBed.inject(RoundBeneficiaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch round beneficiaries from server', () => {
    const response = { success: true, data: [{}] };
    const spy = spyOn(service, 'get').and.returnValue(of(response));

    service.get(1).subscribe((res: any) => {
      expect(res).toEqual(response);
      expect(spy).toHaveBeenCalled();
    });
  });

});
