import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StackCardReportComponent } from './components/container/stack-card-report/stack-card-report.component';

const routes: Routes = [
  { path: 'stack-card-report', component: StackCardReportComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
