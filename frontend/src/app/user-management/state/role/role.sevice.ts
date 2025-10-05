import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { applyTransaction } from '@datorama/akita';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { UtilService } from '../../../shared/services/util.service';
import { Role } from '../../models/role.model';
import { RoleStore } from './role.store';

@Injectable({ providedIn: 'root' })
export class RoleService {

  constructor(private http: HttpClient,private utilService: UtilService, private store: RoleStore) {
  }

  getAll(userId: any) {
    const url = `${environment.apiUrl}/cats_core/users/${userId}/unassigned_roles`;
    return this.http.get<Role[]>(url)
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            this.store.update({allRoles: data});
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
    );
  }

  get(id: any) {
    const url = `${environment.apiUrl}/cats_core/users/${id}/roles`;
    return this.http.get<Role[]>(url)
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

  add(payload: Role) {
    const {user_id, role_id, warehouse_id, hub_id} = payload;
    const url = `${environment.apiUrl}/cats_core/users/${user_id}/assign_role`;
    return this.http.post(url, { role_id, warehouse_id, hub_id })
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            applyTransaction(() => {
              const allRoles = this.store.getValue().allRoles;
              if (allRoles) {
                const newAllRoles = allRoles.filter((role: any) => role.id !== role_id);
                this.store.update({allRoles: newAllRoles});
              }
              this.store.add(data);
            });
            this.utilService.showMessage('success', 'Success', 'User role successfully assigned.');
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  revoke(role: Role, userId: any) {
    const url = `${environment.apiUrl}/cats_core/users/${userId}/revoke_role`;
    return this.http.post(url, { role_id: role.id })
      .pipe(
        tap(({success, error}: any) => {
          if (success) {
            applyTransaction(() => {
              const allRoles = this.store.getValue().allRoles;
              if (allRoles) {
                const newAllRoles = [...allRoles, role];
                this.store.update({allRoles: newAllRoles});
              }
              this.store.remove(role.id);
            });
            this.utilService.showMessage('success', 'Success', 'User role successfully revoked.');
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
