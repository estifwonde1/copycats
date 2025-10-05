import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from '../user-management/component/container/users/users.component';
import { ChangePasswordComponent } from './component/container/change-password/change-password.component';
import { RolesComponent } from './component/container/roles/roles.component';
import { StoreAssignmentComponent } from './component/container/store-assignment/store-assignment.component';
import { StorekeeperStoresComponent } from './component/container/storekeeper-stores/storekeeper-stores.component';

const routes: Routes = [
  { path: '', component: UsersComponent},
  { path: ':id/roles', component: RolesComponent},
  { path: 'store-assignment', component: StoreAssignmentComponent},
  { path: 'store-assignment/:id/stores', component: StorekeeperStoresComponent},
  { path: 'change-password', component: ChangePasswordComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
