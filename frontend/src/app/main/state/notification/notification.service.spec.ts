import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { MessageService } from 'primeng/api';
import { MatDialogModule } from '@angular/material/dialog';
import { NotificationStore } from './notification.store';

describe('NotificationService', () => {
  let service: NotificationService;
  let httpMock: HttpTestingController;
  let store: NotificationStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule
      ],
      providers: [MessageService]
    });
    service = TestBed.inject(NotificationService);
    httpMock = TestBed.inject(HttpTestingController);
    store = TestBed.inject(NotificationStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch notifications from server', () => {
    const url = `${environment.apiUrl}/cats_core/notifications`;
    const response = { success: true, data: [{}] };

    service.get().subscribe(res => {
      expect(res).toEqual(response);
    });

    const testReq = httpMock.expectOne(url);
    expect(testReq.request.method).toBe('GET');
    testReq.flush(response);
    httpMock.verify();
  });

  it('should fetch unread notifications from server', () => {
    const url = `${environment.apiUrl}/cats_core/notifications/unread`;
    const response = { success: true, data: [{}] };

    service.getUnreadNotifications().subscribe(res => {
      expect(res).toEqual(response);
    });

    const testReq = httpMock.expectOne(url);
    expect(testReq.request.method).toBe('GET');
    testReq.flush(response);
    httpMock.verify();
  });

  it('should mark as read notification request', () => {
    const url = `${environment.apiUrl}/cats_core/notifications/1/mark_as_read`;
    const response = { success: true, data: [{}] };
    service.markAsRead(1).subscribe(res => {
      expect(res).toEqual(response);
    });

    const testReq = httpMock.expectOne(url);
    expect(testReq.request.method).toBe('POST');
    testReq.flush(response);
    httpMock.verify();
  });

  it('should return new unread notifications', () => {
    store.update({unread: [{id: 1}, {id: 2}]});
    const newUnread = service.newUnreadRecords(1);
    expect(newUnread.length).toEqual(1);
  });
});
