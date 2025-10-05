import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { Role } from '../../models/role.model';
import { RoleState, RoleStore } from './role.store';

@Injectable({ providedIn: 'root' })
export class RoleQuery extends QueryEntity<RoleState> {

  constructor(protected store: RoleStore) {
    super(store);
  }

  selectAllRoles(): Observable<Role[]> {
    return this.select(state => state.allRoles);
  } 
}
