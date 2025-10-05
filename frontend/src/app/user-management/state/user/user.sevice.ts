import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { User } from '../../../auth/models/user.model';
import { UtilService } from '../../../shared/services/util.service';
import { UserStore } from './user.store';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private http: HttpClient,private utilService: UtilService, private store: UserStore) {
  }

  get(applicationModule: string) {
    const url = `${environment.apiUrl}/cats_core/users?prefix=${applicationModule}`;
    return this.http.get<User[]>(url)
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            this.store.add(data);
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  add(payload: User) {
    const url = `${environment.apiUrl}/cats_core/users`;
    return this.http.post(url, { payload })
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            this.store.add(data);
            this.utilService.showMessage('success', 'Success', 'User registered successfully.');
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  update(id: number, payload: Partial<User>) {
    const url = `${environment.apiUrl}/cats_core/users/${id}`;
    return this.http.put(url, { payload })
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            this.store.update(id, data);
            this.utilService.showMessage('success', 'Success', 'User updated successfully.');
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  changePassword(payload: any) {
    const url = `${environment.apiUrl}/cats_core/change_pass`;
    return this.http.patch(url, {payload}).pipe(
      tap(({success, data, error}: any) => {
        if (success) {
          this.utilService.showMessage('success', 'Success', 'Password updated successfully.');
        } else {
          this.utilService.showAPIErrorResponse(error);
        }
      }, error => {
        this.utilService.showAPIErrorResponse(error.error.error);
      })
    );
  }

  reset(): void {
    this.store.reset();
  }
}
