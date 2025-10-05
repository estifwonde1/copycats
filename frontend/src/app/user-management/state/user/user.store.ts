import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { User } from '../../../auth/models/user.model';

export interface UserState extends EntityState<User> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'users', resettable: true })
export class UserStore extends EntityStore<UserState> {
  constructor() {
    super();
  }

}
