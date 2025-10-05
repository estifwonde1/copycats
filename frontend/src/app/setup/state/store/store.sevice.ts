import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { UtilService } from '../../../shared/services/util.service';
import { Store } from '../../models/store.model';
import { LocationStore } from '../location/location.store';
import { StorekeeperStoresStore, StoreStore } from './store.store';

@Injectable({ providedIn: 'root' })
export class StoreService {

  constructor(private store: StoreStore, private http: HttpClient,
              private utilService: UtilService,
              private locationStore: LocationStore,
              private storekeeperStoresStore: StorekeeperStoresStore) {}

  get(warehouse?: number) {
    const url = `${environment.apiUrl}/cats_core/stores`;
    const fullUrl = warehouse ? `${url}?id=${warehouse}`: url;
    return this.http.get<Store[]>(fullUrl)
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            this.store.set(data);
          } else {
            this.utilService.showAPIErrorResponse(error)
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  add(payload: Store) {
    const url = `${environment.apiUrl}/cats_core/stores`;
    return this.http.post(url, { payload })
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            this.store.add(data);
            this.utilService.showMessage('success', 'Success', 'Store registered successfully.');
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  update(id: number, payload: Partial<Store>) {
    const url = `${environment.apiUrl}/cats_core/stores/${id}`;
    return this.http.put(url, { payload })
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            this.store.update(id, data);
            this.utilService.showMessage('success', 'Success', 'Store updated successfully.');
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  currentUserWarehouses(userId: number): Observable<any> {
    const url = `${environment.apiUrl}/cats_core/users/${userId}/warehouse`;
    return this.http.get(url)
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            this.store.update({currentUserWarehouses: [data]});
          }else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      )
  }

  getCurrentUserStores(userId: number): Observable<Store[]> {
    const url = `${environment.apiUrl}/cats_core/users/${userId}/stores`;
    return this.http.get(url)
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            this.store.update({currentUserStores: data});
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  getStorekeeperStores(storekeeperId: number): Observable<Store[]> {
    const url = `${environment.apiUrl}/cats_core/users/${storekeeperId}/stores`;
    return this.http.get(url)
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            this.storekeeperStoresStore.set(data);
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  hubStores(hubId: number) {
    const url = `${environment.apiUrl}/cats_core/hubs/${hubId}/stores`;
    return this.http.get(url)
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            this.store.set(data);
          } else {
            this.utilService.showAPIErrorResponse(error)
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  storeFdp(storeId: any) {
    const url = `${environment.apiUrl}/cats_core/stores/${storeId}/fdp`;
    return this.http.get(url)
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            this.locationStore.set(data);
          } else {
            this.utilService.showAPIErrorResponse(error)
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  
  assignStore(storekeeperId: any, payload: any): any {
    const url = `${environment.apiUrl}/cats_core/storekeeper/${storekeeperId}/assign_stores`;
    return this.http.post(url, { payload })
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            this.storekeeperStoresStore.add(data);
            this.utilService.showMessage('success', 'Success', 'Store assigned successfully.');
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  unassignStore(storekeeperId: any, payload: any): any {
    const url = `${environment.apiUrl}/cats_core/storekeeper/${storekeeperId}/unassign_stores`;
    return this.http.post(url, { payload })
      .pipe(
        tap(({success, error}: any) => {
          if (success) {
            this.storekeeperStoresStore.remove(payload.store_id);
            this.utilService.showMessage('success', 'Success', 'Store unassigned successfully.');
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
