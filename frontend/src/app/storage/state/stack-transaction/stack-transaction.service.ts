import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { UtilService } from '../../../shared/services/util.service';
import { environment } from '../../../../environments/environment';
import { StackTransaction } from '../../models/stack-transaction.model';
import { StackTransactionStore } from './stack-transaction.store';

@Injectable({
  providedIn: 'root'
})
export class StackTransactionService {

  constructor(private http: HttpClient,
              private store: StackTransactionStore,
              private utilService: UtilService) { }

    filter(criteria: any) {
      const url = `${environment.apiUrl}/cats_core/stack_transactions/filter`;
      return this.http.post(url, {q: criteria})
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

    add(payload: StackTransaction) {
      const url = `${environment.apiUrl}/cats_core/stack_transactions`;
      return this.http.post(url, {payload})
        .pipe(
          tap(({success, data, error}: any) => {
            if (success) {
              this.store.add(data);
              this.utilService.showMessage('success', 'Success', 'Stack transaction registered successfully.');
            } else {
              this.utilService.showAPIErrorResponse(error);
            }
          }, error => {
            this.utilService.showAPIErrorResponse(error.error.error);
          })
        );
  }

  update(id: number, payload: Partial<StackTransaction>) {
    const url = `${environment.apiUrl}/cats_core/stack_transactions/${id}`;
    return this.http.put(url, { payload })
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            this.store.update(id, data); 
            this.utilService.showMessage('success', 'Success', 'Stack transaction updated successfully.');
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  commit(id: number) {
    const url = `${environment.apiUrl}/cats_core/stack_transactions/${id}/commit`;
    return this.http.post(url, {} ).pipe(
        tap(({success, data, error}: any) => {
                if (success) {
                    this.store.update(id, data);
                } else {
                    this.utilService.showAPIErrorResponse(error);
                }
            }, error => {
                this.utilService.showAPIErrorResponse(error.error.error);
        })
    );
  }


  reset() {
    this.store.reset();
  }          
            
}
