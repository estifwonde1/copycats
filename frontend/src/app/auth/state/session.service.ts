import { SessionStore } from './session.store';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BaseService } from '../../shared/services/base.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { UtilService } from '../../shared/services/util.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  constructor(private store: SessionStore,
              private service: BaseService,
              private utilService: UtilService) {
  }

  login(email: string, password: string) {
    const auth = { email, password };
    const url = this.service.getUrl('cats_core/login', environment);

    return this.service.post(url, { auth, tokenize: false })
      .pipe(
        tap(session => this.store.login(session))
      );
  }

  logout() {
    this.store.logout();
  }

  getUsersByRole(role: string) {
    const url = `${environment.apiUrl}/cats_core/roles/${role}/users`;
    return this.service.get(url)
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            this.store.update({ usersByRole: data });
          } else {
            this.utilService.showMessage('error', 'Error', error);
          }
        }, error => {
          this.utilService.showMessage('error', 'Error', error.error.error);
        })
      )
  }
}
