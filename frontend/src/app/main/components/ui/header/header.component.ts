import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'cats-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() toggleMenu = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  @Output() clickNotification = new EventEmitter<void>();
  @Input() username = '';
  @Input() unreadNotifications$: Observable<any[]>;

  constructor() { }

  ngOnInit(): void {
  }

  onToggleMenu(): void {
    this.toggleMenu.emit();
  }

  onLogout(): void {
    this.logout.emit();
  }

  onNotificationClick(notification: any): void {
    this.clickNotification.emit(notification);
  }

  totalUnreadMessages(unreadMessages: any[]): number {
    return unreadMessages.reduce((acc, unreadMessage) => acc = acc +unreadMessage.length, 0);
  }

}
