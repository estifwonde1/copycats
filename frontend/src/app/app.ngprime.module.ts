import { NgModule } from '@angular/core';
import { SidebarModule } from 'primeng/sidebar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitterModule } from 'primeng/splitter';
import { ListboxModule } from 'primeng/listbox';
import { TreeTableModule } from 'primeng/treetable';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

@NgModule({
    exports: [
        SidebarModule,
        PanelMenuModule,
        DropdownModule,
        TableModule,
        ToolbarModule,
        SplitterModule,
        ListboxModule,
        TreeTableModule,
        ConfirmPopupModule,
        BreadcrumbModule,
        ConfirmDialogModule
    ]
})
export class NgPrimeModule { }
