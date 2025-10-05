import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { UtilService } from '../../../shared/services/util.service';
import { StackingRuleStore } from './stacking-rule.store';

@Injectable({ providedIn: 'root' })
export class StackingRuleService {

  constructor(private store: StackingRuleStore, private http: HttpClient,
              private utilService: UtilService) {
  }

  get() {
    const url = `${environment.apiUrl}/stacking_rules`;
    return this.http.get<any[]>(url)
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
