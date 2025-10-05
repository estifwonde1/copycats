import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AppCommonModule } from '../app.common.module';
import { UsersComponent } from './component/container/users/users.component';
import { UsersFormComponent } from './component/ui/users-form/users-form.component';
import { RolesComponent } from './component/container/roles/roles.component';
import { RolesFormComponent } from './component/ui/roles-form/roles-form.component';
import { StoreAssignmentComponent } from './component/container/store-assignment/store-assignment.component';
import { StorekeeperStoresComponent } from './component/container/storekeeper-stores/storekeeper-stores.component';
import { StoreAssignmentFormComponent } from './component/ui/store-assignment-form/store-assignment-form.component';
import { ChangePasswordComponent } from './component/container/change-password/change-password.component';


@NgModule({
  declarations: [
    UsersComponent, 
    UsersFormComponent, 
    RolesComponent, 
    RolesFormComponent, 
    StoreAssignmentComponent, 
    StorekeeperStoresComponent, StoreAssignmentFormComponent, ChangePasswordComponent
  ],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    SharedModule,
    AppCommonModule
  ]
})
export class UserManagementModule { }
