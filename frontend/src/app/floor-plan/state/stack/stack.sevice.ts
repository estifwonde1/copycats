import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { applyTransaction } from '@datorama/akita';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Store } from '../../../setup/models/store.model';
import { StoreStore } from '../../../setup/state/store/store.store';
import { UtilService } from '../../../shared/services/util.service';
import { Stack } from '../../models/stack.model';
import { StackStore } from './stack.store';

@Injectable({ providedIn: 'root' })
export class StackService {

  constructor(private store: StackStore, private http: HttpClient,
              private utilService: UtilService, private storeStore: StoreStore) {
  }

  get(storeId: number) {
    const url = `${environment.apiUrl}/cats_core/stores/${storeId}/stacks`;
    return this.http.post<any[]>(url, {q: { stack_status_not_eq: 'Destroyed' }})
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            this.store.set(data);
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  add(payload: Stack) {
    const url = `${environment.apiUrl}/cats_core/stacks`;
    return this.http.post(url, { payload })
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            applyTransaction(() => {
              this.store.add(data);
              this.addStackToStore(data);
            });
            this.utilService.showMessage('success', 'Success', 'Stack registered successfully.');
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  update(id: number, payload: Partial<Stack>) {
    const url = `${environment.apiUrl}/cats_core/stacks/${id}`;
    return this.http.put(url, { payload })
    .pipe(
      tap(({success, data, error}: any) => {
        if (success) {
            applyTransaction(() => {
              this.store.update(id, data);
              this.updateStackToStore(payload);
            });
            this.utilService.showMessage('success', 'Success', 'Stack updated successfully.');
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  commodityStack(receiptAuthId: number) {
    const url = `${environment.apiUrl}/cats_core/receipt_authorizations/${receiptAuthId}/stacks`;
    return this.http.get<any[]>(url)
      .pipe(
        tap((result: any) => {
          if (result.success) {
            this.store.set(result.data);
          } else {
            this.utilService.showAPIErrorResponse(result.errors);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.errors);
        })
      );
  }

  dispatchStacks(dispatchId: number) {
    const url = `${environment.apiUrl}/cats_core/dispatches/${dispatchId}/stacks`;
    return this.http.get<any[]>(url)
      .pipe(
        tap((result: any) => {
          if (result.success) {
            this.store.set(result.data);
          } else {
            this.utilService.showAPIErrorResponse(result.errors);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.errors);
        })
      );
  }

  getCommodities() {
    const url = `${environment.apiUrl}/cats_core/stacks/items_for_location`;
    return this.http.get<any[]>(url)
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            this.store.update({commodities: data});
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  addStackToStore(newStack: Stack): void {
    let stacks = this.getStoreStacks(newStack);
    stacks.push(newStack);
    this.updateCurrentUserStores(stacks, newStack.store_id);
  }

  updateStackToStore(updatedStack: any): void {
    let stacks: Stack[] = this.getStoreStacks(updatedStack);
    const index = stacks.findIndex((stack: Stack) => stack.id === updatedStack.id);
    stacks.splice(index, 1, updatedStack);
    this.updateCurrentUserStores(stacks, updatedStack.store_id);
  }

  getStoreStacks(stack: Partial<Stack>): Stack[] {
    const { store_id } = stack;
    const store = this.storeStore.getValue().currentUserStores.filter((store: any) => store.id === store_id)[0];
    return store.stacks;
  }

  updateCurrentUserStores(stacks: Stack[], storeId: number): void {
    const currentStore = (store: Store) => store.id === storeId;
    const index = this.storeStore.getValue().currentUserStores.findIndex(currentStore);
    const store = this.storeStore.getValue().currentUserStores.filter(currentStore)[0];
    this.storeStore.getValue().currentUserStores.splice(index, 1, {...store, stacks});
  }

  filter(storeId: number, query: any) {
    const url = `${environment.apiUrl}/cats_core/stores/${storeId}/stacks`;
    return this.http.post<any[]>(url, {q: query})
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            this.store.set(data);
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }
}
