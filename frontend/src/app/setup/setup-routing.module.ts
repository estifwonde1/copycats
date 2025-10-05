import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationComponent } from './components/container/location/location.component';
import { StoreComponent } from './components/container/store/store.component';

const routes: Routes = [
  { path: 'location', component: LocationComponent},
  { path: 'store', component: StoreComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupRoutingModule { }
