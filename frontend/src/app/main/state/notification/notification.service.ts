import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { applyTransaction } from '@datorama/akita';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { UtilService } from '../../../shared/services/util.service';
import { NotificationStore } from './notification.store';

@Injectable({ providedIn: 'root' })
export class NotificationService {

  constructor(private http: HttpClient, private store: NotificationStore, private utilService: UtilService) {
  }

  get(): Observable<any> {
    const url = `${environment.apiUrl}/cats_core/notifications`;
    return this.http.get<any[]>(url)
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

  getUnreadNotifications(): Observable<any> {
    const url = `${environment.apiUrl}/cats_core/notifications/unread`;
    return this.http.get<any[]>(url)
    .pipe(
      tap(({success, data, error}: any) => {
        if (success) {
          this.store.update({unread: data});
        } else {
          this.utilService.showAPIErrorResponse(error);
        }
      }, error => {
        this.utilService.showAPIErrorResponse(error.error.error);
      })
    );
  }

  markAsRead(id: number): Observable<any> {
    const url = `${environment.apiUrl}/cats_core/notifications/${id}/mark_as_read`;
    return this.http.post(url, {})
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            applyTransaction(() => {
              this.store.update(id, data);
              this.store.update({unread: this.newUnreadRecords(id)});
            });
          }  else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      )
  }

  newUnreadRecords(id: number): any[] {
    const unread = this.store.getValue().unread;
    return unread?.filter((un: any) => un.id !== id);
  }

  markAsUnRead(id: number): Observable<any> {
    const url = `${environment.apiUrl}/cats_core/notifications/${id}/mark_as_unread`;
    return this.http.post(url, {})
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            this.store.update(id, data);
          }  else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      )
  }

  reset(): void {
    this.store.reset();
  }
}
