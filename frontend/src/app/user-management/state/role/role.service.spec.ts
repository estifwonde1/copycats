import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { RoleService } from './role.sevice';
import { Role } from '../../models/role.model';

describe('RoleService', () => {
  let service: RoleService;
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
    service = TestBed.inject(RoleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user roles from server', () => {
    const url = `${environment.apiUrl}/cats_core/users/1/roles`;
    const response = { success: true, data: [{}] };

    service.get(1).subscribe(res => {
      expect(res).toEqual(response);
    });

    const testReq = httpMock.expectOne(url);
    expect(testReq.request.method).toBe('GET');
    testReq.flush(response);
    httpMock.verify();
  });

  it('should add role', () => {
    const url = `${environment.apiUrl}/cats_core/users/1/assign_role`;
    const response = { success: true, data: [{}] };
    const payload: Role = {
      user_id: 1,
      name: 'warehouse_manager'
    };

    service.add(payload).subscribe(res => {
      expect(res).toEqual(response);
    });

    const testReq = httpMock.expectOne(url);
    expect(testReq.request.method).toBe('POST');
    testReq.flush(response);
    httpMock.verify();
  });

  it('should revoke role', () => {
    const url = `${environment.apiUrl}/cats_core/users/1/revoke_role`;
    const response = { success: true, data: [{}] };
    const payload: Role = {
      id: 1,
      user_id: 1,
      name: 'warehouse_manager'
    };

    service.revoke(payload, 1).subscribe(res => {
      expect(res).toEqual(response);
    });

    const testReq = httpMock.expectOne(url);
    expect(testReq.request.method).toBe('POST');
    testReq.flush(response);
    httpMock.verify();
  });
});
