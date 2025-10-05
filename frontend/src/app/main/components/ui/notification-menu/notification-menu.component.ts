import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'cats-notification-menu',
  templateUrl: './notification-menu.component.html',
  styleUrls: ['./notification-menu.component.scss']
})
export class NotificationMenuComponent implements OnInit {
  @Input() unreadNotifications$: Observable<any[]>;
  @Output() clickNotification = new EventEmitter<void>();

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onClick(notification: any): void {
    this.clickNotification.emit(notification);
  }

  showAll(): void {
    this.router.navigate(['main', 'notifications']);
  }
}
