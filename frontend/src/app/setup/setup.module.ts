import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SetupRoutingModule } from './setup-routing.module';
import { LocationComponent } from './components/container/location/location.component';
import { LocationFormComponent } from './components/ui/location-form/location-form.component';
import { LocationFilterComponent } from './components/ui/location-filter/location-filter.component';
import { AppCommonModule } from '../app.common.module';
import { SharedModule } from '../shared/shared.module';
import { StoreComponent } from './components/container/store/store.component';
import { StoreFormComponent } from './components/ui/store-form/store-form.component';


@NgModule({
  declarations: [
    LocationComponent,
    LocationFormComponent,
    LocationFilterComponent,
    StoreComponent,
    StoreFormComponent
  ],
  imports: [
    CommonModule,
    SetupRoutingModule,
    AppCommonModule,
    SharedModule
  ]
})
export class SetupModule { }
