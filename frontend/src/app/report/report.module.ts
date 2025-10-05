import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { StackCardReportComponent } from './components/container/stack-card-report/stack-card-report.component';
import { AppCommonModule } from '../app.common.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    StackCardReportComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    SharedModule,
    AppCommonModule
  ]
})
export class ReportModule { }
