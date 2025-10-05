import { Injectable } from '@angular/core';
import { StoreConfig, EntityState, EntityStore } from '@datorama/akita';

export interface NotificationState extends EntityState<any> {}


@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'notification', resettable: true })
export class NotificationStore extends EntityStore<NotificationState> {
  constructor() {
    super();
  }

}
