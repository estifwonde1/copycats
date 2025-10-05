import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

import { Observable } from 'rxjs';
import { NotificationQuery } from '../../../state/notification/notification.query';
import { NotificationService } from '../../../state/notification/notification.service';

@Component({
  selector: 'cats-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI: NgBlockUI;
  selectedNotificationValue: any;

  notifications$: Observable<any[]> = this.query.selectNotifications();

  constructor(private service: NotificationService,
              private query: NotificationQuery,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadNotifications();
    this.route.params.subscribe(params => {
      this.selectNotification(+params['id']);
    });
  }

  loadNotifications(): void {
    this.blockUI.start('Loading...');
    this.service.get().subscribe(
      () => this.blockUI.stop(), () => this.blockUI.stop()
    );
  }

  onClick(): void {
    this.router.navigate(['main', 'notifications', this.selectedNotificationValue.id]);
    this.markAsRead(this.selectedNotificationValue);
  }

  selectNotification(id: number): void {
    this.notifications$.subscribe(notifications => {
      notifications.forEach(notification => {
        const selectedNotification = notification.items?.filter((nt: any) => nt.id === id)[0];
        this.markAsRead(selectedNotification);
        if(selectedNotification) this.selectedNotificationValue = selectedNotification;
      });
    });
  }

  markAsRead(selectedNotification: any): void {
    if (selectedNotification && !selectedNotification.read) {
      this.service.markAsRead(selectedNotification.id).subscribe();
    }
  }

  ngOnDestroy(): void {
    this.service.reset();
  }
}
