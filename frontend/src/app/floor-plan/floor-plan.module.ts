import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FloorPlanRoutingModule } from './floor-plan-routing.module';
import { FloorPlanComponent } from './components/container/floor-plan/floor-plan.component';
import { FloorPlanFormComponent } from './components/ui/floor-plan-form/floor-plan-form.component';
import { AppCommonModule } from '../app.common.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    FloorPlanComponent,
    FloorPlanFormComponent
  ],
  imports: [
    CommonModule,
    FloorPlanRoutingModule,
    AppCommonModule,
    SharedModule
  ]
})
export class FloorPlanModule { }
