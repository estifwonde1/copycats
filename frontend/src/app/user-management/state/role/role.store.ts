import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Role } from '../../models/role.model';

export interface RoleState extends EntityState<Role> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'user-roles', resettable: true })
export class RoleStore extends EntityStore<RoleState> {
  constructor() {
    super();
  }

}
