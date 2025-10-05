import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { UserService } from './user.sevice';
import { User } from '../../../auth/models/user.model';

describe('UserService', () => {
  let service: UserService;
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
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch users from server', () => {
    const url = `${environment.apiUrl}/cats_core/users?prefix=CATS-WH`;
    const response = { success: true, data: [{}] };

    service.get('CATS-WH').subscribe(res => {
      expect(res).toEqual(response);
    });

    const testReq = httpMock.expectOne(url);
    expect(testReq.request.method).toBe('GET');
    testReq.flush(response);
    httpMock.verify();
  });
  
  it('should add user', () => {
    const url = `${environment.apiUrl}/cats_core/users`;
    const response = { success: true, data: [{}] };
    const payload: User = {
      first_name: 'Abebe', last_name: 'Kebe', phone_number: '0923434344', application_prefix: 'CATS-WH',
      email: 'abe@cats.com'
    };

    service.add(payload).subscribe(res => {
      expect(res).toEqual(response);
    });

    const testReq = httpMock.expectOne(url);
    expect(testReq.request.method).toBe('POST');
    testReq.flush(response);
    httpMock.verify();
  });

  it('should update user', () => {
    const updatedId = 1;
    const url = `${environment.apiUrl}/cats_core/users/${updatedId}`;
    const response = { success: true, data: [{}] };
    const payload: User = {
      first_name: 'Abebe', last_name: 'Kebe', phone_number: '0923434344', application_prefix: 'CATS-WH',
      email: 'abe@cats.com'
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
