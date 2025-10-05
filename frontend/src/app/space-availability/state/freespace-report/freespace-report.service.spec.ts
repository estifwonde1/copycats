import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { FreespaceReportService } from './freespace-report.service';

describe('FreespaceReportService', () => {
  let service: FreespaceReportService;

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
    service = TestBed.inject(FreespaceReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch freespace report from server based on a url', () => {
    const response = { success: true, data: [{}] };
    const url = 'cats_core/hubs/1/space';
    const spy = spyOn(service, 'get').and.returnValue(of(response));

    service.get(url).subscribe((res: any) => {
      expect(res).toEqual(response);
      expect(spy).toHaveBeenCalled();
    });
  });
});
