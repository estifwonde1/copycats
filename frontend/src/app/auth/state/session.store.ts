import { Store, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment';
import { StorageService } from '../../shared/services/storage.service';


export interface SessionState {
  token: string;
  user: User;
  usersByRole?: any;
}

export function createInitialState(): SessionState {
  const token = JSON.parse(localStorage.getItem(environment.sessionKey));
  if (token) {
    const jwt = new JwtHelperService();
    const decoded = jwt.decodeToken(token);
    return {
      token,
      user: decoded,
    };
  } else {
    return {
      token: null,
      user: null,
    };
  }
}

@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'session' })
export class SessionStore extends Store<SessionState> {
  constructor(private service: StorageService) {
    super(createInitialState());
  }

  login(state: SessionState) {
    this.update(state);
    this.service.save(environment.sessionKey, state.token);
  }

  logout() {
    this.service.remove(environment.sessionKey);
    this.update(createInitialState());
  }
}
