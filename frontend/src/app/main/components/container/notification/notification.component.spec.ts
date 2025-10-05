import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { NotificationService } from '../../../state/notification/notification.service';

import { NotificationComponent } from './notification.component';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;
  let service: NotificationService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationComponent ],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        RouterTestingModule
      ],
      providers: [MessageService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.inject(NotificationService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('selectNotification', () => {
    beforeEach(() => {
      component.notifications$ = of([{items: [{id: 1, title: 'Test'}, {id: 2, title: 'Test2'}]}, {items: [{id: 3}]}]);
    });

    it('should set selected notification', () => {
      component.selectNotification(1);
      expect(component.selectedNotificationValue).toEqual({id: 1, title: 'Test'});
    });

    it('should call markAsRead method', () => {
      const spy = spyOn(component, 'markAsRead');
      component.selectNotification(1);
      expect(spy).toHaveBeenCalledWith({id: 1, title: 'Test'});
    });
  });


  it('should call markAsRead method of notification service', () => {
    const selectedNotification = {read: false, id: 1};
    const spy = spyOn(service, 'markAsRead').and.returnValue(of({}));
    component.markAsRead(selectedNotification);
    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should call navigate method of router service', () => {
    component.selectedNotificationValue = {id: 1};
    const spy = spyOn(router, 'navigate');
    component.onClick();
    expect(spy).toHaveBeenCalledWith(['main', 'notifications', 1]);
  });
});
