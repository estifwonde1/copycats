import { Query } from '@datorama/akita';
import { SessionState, SessionStore } from './session.store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SessionQuery extends Query<SessionState> {

  constructor(protected store: SessionStore) {
    super(store);
  }

  get token() {
    return this.getValue().token;
  }

  get userId() : number {
    return this.getValue().user?.id;
  }

  get userDetails(): any {
    return this.getValue().user?.details;
  }

  get email(): any {
    return this.getValue().user?.email;
  }

  get UserRoles(): any {
    return this.getValue().user?.roles;
  }

  isLoggedIn() {
    return !!(this.getValue().token);
  }

  selectUserRoles(): Observable<any[]> {
    return this.select(state => state.user).pipe(map(u => u.roles));
  }

  selectUsersByRole(): Observable<any> {
    return this.select( state => state.usersByRole);
  }
}
