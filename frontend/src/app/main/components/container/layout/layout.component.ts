import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { SessionQuery } from '../../../../auth/state/session.query';
import { SessionService } from '../../../../auth/state/session.service';
import { MenuQuery } from '../../../state/menu/menu.query';
import { MenuService } from '../../../state/menu/menu.service';
import { NotificationQuery } from '../../../state/notification/notification.query';
import { NotificationService } from '../../../state/notification/notification.service';

@Component({
  selector: 'cats-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  isSidebarVisible = true;
  menus$: Observable<MenuItem[]> = this.query.selectMenuItems();
  username$: Observable<string> = this.sessionQuery.select(state =>
    state.user ? `${state.user.first_name} ${state.user.last_name}` : null);

  unreadNotifications$: Observable<any[]> = this.notificationQuery.selectUnreadNotifications();
  loading$: Observable<boolean> = this.query.selectLoading();

  constructor(private service: MenuService,
              private query: MenuQuery,
              private sessionQuery: SessionQuery,
              private sessionService: SessionService,
              private router: Router,
              private notificationService: NotificationService,
              private notificationQuery: NotificationQuery) { }

  ngOnInit(): void {
    this.service.get().subscribe();
    this.notificationService.getUnreadNotifications().subscribe();
  }

  setupLoader() {
    this.loading$.subscribe(loading => {
      if (loading) {
        this.blockUI.start('Loading ...');
      } else {
        this.blockUI.stop();
      }
    });
  }

  toggleMenu(): void {
     this.isSidebarVisible = !this.isSidebarVisible;
  }

  onLogout(): void {
    this.sessionService.logout();
    this.router.navigate(['/login']);
  }

  onNotificationClick(notification: any) {
    this.notificationService.markAsRead(notification?.id).subscribe();
    this.router.navigate(['main', 'notifications', notification?.id]);
  }

}
