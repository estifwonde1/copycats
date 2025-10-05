import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpaceAvailabilityRoutingModule } from './space-availability-routing.module';
import { MaterialModule } from '../app.material.module';
import { NgPrimeModule } from '../app.ngprime.module';
import { AppCommonModule } from '../app.common.module';
import { SharedModule } from '../shared/shared.module';
import { FreespaceReportComponent } from './components/container/freespace-report/freespace-report.component';


@NgModule({
  declarations: [
    FreespaceReportComponent
  ],
  imports: [
    CommonModule,
    SpaceAvailabilityRoutingModule,
    MaterialModule,
    NgPrimeModule,
    AppCommonModule,
    SharedModule
  ]
})
export class SpaceAvailabilityModule { }
