import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { NotificationQuery } from '../../../state/notification/notification.query';

@Component({
  selector: 'cats-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  @Input() visible = true;
  @Input() items: MenuItem[] | null= [];
  @Input() unreadNotifications$: Observable<any[]> = this.notificationQuery.selectUnreadNotifications();
  @Input() username = '';

  constructor(private notificationQuery: NotificationQuery,
              private router: Router) { }

  ngOnInit(): void {

  }

  totalUnreadMessages(unreadMessages: any[]): number {
    return unreadMessages.reduce((acc, unreadMessage) => acc = acc +unreadMessage.length, 0);
  }

  onNotificationClick() {
    this.router.navigate(['main', 'notifications']);
  }
}
