import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { LocationService } from './location.sevice';
import { environment } from '../../../../environments/environment';
import { Location } from '../../models/location.model';

describe('LocationService', () => {
  let service: LocationService;
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
    service = TestBed.inject(LocationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch locations from server', () => {
    const locationType = 'Warehouse';
    const url = `${environment.apiUrl}/cats_core/locations?location_type=${locationType}`;
    const response = { success: true, data: [{}] };

    service.get(locationType).subscribe(res => {
      expect(res).toEqual(response);
    });

    const testReq = httpMock.expectOne(url);
    expect(testReq.request.method).toBe('GET');
    testReq.flush(response);
    httpMock.verify();
  });

  it('should add location', () => {
    const url = `${environment.apiUrl}/cats_core/locations`;
    const response = { success: true, data: [{}] };
    const payload: Location = {
      id: 1, name: 'Location One', description: 'Sample location', location_type: 'Region'
    };

    service.add(payload).subscribe(res => {
      expect(res).toEqual(response);
    });

    const testReq = httpMock.expectOne(url);
    expect(testReq.request.method).toBe('POST');
    testReq.flush(response);
    httpMock.verify();
  });

  it('should update location', () => {
    const updatedId = 1;
    const url = `${environment.apiUrl}/cats_core/locations/${updatedId}`;
    const response = { success: true, data: [{}] };
    const payload: Location = {id: 1, name: 'Location One', description: 'Sample location', location_type: 'Region'};

    service.update(updatedId, payload).subscribe(res => {
      expect(res).toEqual(response);
    });

    const testReq = httpMock.expectOne(url);
    expect(testReq.request.method).toBe('PUT');
    testReq.flush(response);
    httpMock.verify();
  });

});
