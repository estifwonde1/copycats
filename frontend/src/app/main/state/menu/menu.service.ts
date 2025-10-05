import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { UtilService } from '../../../shared/services/util.service';
import { MenuStore } from './menu.store';

@Injectable({ providedIn: 'root' })
export class MenuService {

  constructor(private http: HttpClient, private store: MenuStore, private utilService: UtilService) {
  }

  get(): Observable<any> {
    const url = `${environment.apiUrl}/cats_core/menus`;
    return this.http.get<any[]>(url)
    .pipe(
      tap(({success, data, error}: any) => {
        if (success) {
          this.store.set(data);
        } else {
          this.utilService.showAPIErrorResponse(error);
        }
      }, error => {
        this.utilService.showAPIErrorResponse(error.error.error)
      })
    );
  }


}
