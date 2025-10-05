import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FreespaceReportComponent } from './components/container/freespace-report/freespace-report.component';

const routes: Routes = [
  { path: 'freespace-report', component: FreespaceReportComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpaceAvailabilityRoutingModule { }
