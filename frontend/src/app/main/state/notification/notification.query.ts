import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { NotificationStore, NotificationState } from './notification.store';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class NotificationQuery extends QueryEntity<NotificationState> {

  constructor(protected store: NotificationStore) {
    super(store);
  }

  selectUnreadNotifications(): Observable<any> {
    return this.select(state => this.groupByDate(state.unread));
  }

  selectNotifications(): Observable<any[]> {
    return this.selectAll().pipe(
      map((items: any) => this.formatNotificationObject(this.groupByDate(items)))
    )
  }

  formatNotificationObject(items: any[]): any[] {
    return items.map(item => {return {created_at: item[0]?.created_at, items: item}})
  }

  groupByDate(notifications: any[]): any {
    const obj =_.groupBy(this.formatCreatedAtTime(notifications),'notification_date');
    return _.values(obj);
  }

  formatCreatedAtTime(notifications: any[]): any {
    return notifications?.map((notification: any) =>
    {return {...notification, notification_date: this.shortenDate(notification.created_at)}});
  }

  shortenDate(original: string): string {
    return original.slice(0, 10);
  }
}
