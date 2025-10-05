import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './components/list/list.component';
import { AppCommonModule } from '../app.common.module';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { TimeAgoPipe } from './pipes/time-ago.pipe';

@NgModule({
  declarations: [
    ListComponent,
    ToolbarComponent,
    TimeAgoPipe
  ],
  imports: [
    CommonModule,
    AppCommonModule
  ],
  exports: [
    ListComponent,
    ToolbarComponent,
    TimeAgoPipe
  ]
})
export class SharedModule { }
