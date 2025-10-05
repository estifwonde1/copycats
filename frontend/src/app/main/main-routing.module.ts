import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../../app/main/components/container/layout/layout.component';
import { AuthGuard } from '../auth/services/auth-guard';
import { NotificationComponent } from './components/container/notification/notification.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'floor-plan', loadChildren: () => import('../floor-plan/floor-plan.module').then(m => m.FloorPlanModule)},
      { path: 'setups', loadChildren: () => import('../setup/setup.module').then(m => m.SetupModule)},
      { path: 'space-availability',
       loadChildren: () => import('../space-availability/space-availability.module').then(m => m.SpaceAvailabilityModule) },
      { path: 'receipts', loadChildren: () => import('../receipt/receipt.module').then(m => m.ReceiptModule)},
      { path: 'stacking', loadChildren: () => import('../storage/storage.module').then(m => m.StorageModule) },
      { path: 'dispatches', loadChildren: () => import('../dispatch/dispatch.module').then(m => m.DispatchModule)},
      { path: 'notifications', component: NotificationComponent},
      { path: 'notifications/:id', component: NotificationComponent},
      { path: 'users', loadChildren: () => import('../user-management/user-management.module').then(m => m.UserManagementModule)},
      { path: 'reports', loadChildren: () => import('../report/report.module').then(m => m.ReportModule)},
      { path: 'distribution',
        loadChildren: () => import('../distribution-management/distribution-management.module').then(m => m.DistributionManagementModule)}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
