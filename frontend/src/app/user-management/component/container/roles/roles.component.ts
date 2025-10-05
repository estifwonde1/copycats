import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Location } from '../../../../setup/models/location.model';
import { LocationQuery } from '../../../../setup/state/location/location.query';
import { LocationService } from '../../../../setup/state/location/location.sevice';
import { SUPPLIER } from '../../../../shared/constants/supplier-dummy-data.constant';
import { USER_ROLES } from '../../../../shared/constants/user-roles.constant';
import { Column } from '../../../../shared/models/column.model';
import { DialogConfig } from '../../../../shared/models/dialog-config.model';
import { DialogService } from '../../../../shared/services/dialog.service';
import { EMPTY_ROLE, Role } from '../../../models/role.model';
import { RoleQuery } from '../../../state/role/role.query';
import { RoleService } from '../../../state/role/role.sevice';
import { RolesFormComponent } from '../../ui/roles-form/roles-form.component';

@Component({
  selector: 'cats-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI: NgBlockUI;

  applicationPrefix = 'CATS-WH';

  caption = 'User Roles';

  actions: any[] = [
    { icon: 'add', label: 'New'}
  ];

  dialogConfig: DialogConfig = {
    width: '800px',
    formComponent: RolesFormComponent,
    dialog: this.dialog,
    service: this.service,
    parentComponent: this
  } as DialogConfig;

  columns: Column[] = [
    { name: 'name', label: 'Name' }
  ];

  tableActions = [
    { icon: 'clear', color: 'warn', tooltip: 'Revoke'}
  ];
  roles$: Observable<Role[]> = this.query.selectAll();
  allRoles$: Observable<Role[]> = this.query.selectAllRoles();
  loading$: Observable<boolean> = this.query.selectLoading();
  userId: number = +this.route.snapshot.params['id'];
  warehouses$: Observable<Location[]> = this.locationQuery.selectAll();
  hubs$: Observable<Location[]> = this.locationQuery.selectAll();

  items: MenuItem[] = [
    {label: 'Users', routerLink: '../..'},
    {label: 'User Roles'},
  ];
  constructor(private service: RoleService,
              private query: RoleQuery,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              private locationService: LocationService,
              private locationQuery: LocationQuery,
              private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.service.get(this.userId).subscribe();
    this.service.getAll(this.userId).subscribe();
  }

  onRoleChange(dialogRef: any): any {
    const sub = (dialogRef.componentInstance as any).roleSelect.subscribe((data: any) => {
      this.locationService.reset();
      this.allRoles$.subscribe((roles: any) => {
        const selectedRoleName = roles?.filter((role: any) => role.id === data)[0]?.name
        if (selectedRoleName === USER_ROLES.WAREHOUSE_MANAGER) {
          this.loadWarehouses();
        } else if(selectedRoleName === USER_ROLES.HUB_MANAGER){
          this.loadHubs();
        }
      });
    });
    return sub;
  }

  loadWarehouses(): void {
    this.blockUI.start('Loading...');
    this.locationService.get('Warehouse').subscribe(() =>{
      this.blockUI.stop();}, () => this.blockUI.stop());
  }

  loadHubs(): void {
    this.blockUI.start('Loading...');
    this.locationService.get('Hub').subscribe(() => {
      this.blockUI.stop();
    }, () => this.blockUI.stop());
  }

  onCreate(): void {
    this.dialogConfig.title = 'Add New Role';
    this.dialogConfig.lookupData = {
      roles$: this.allRoles$,
      warehouses$: this.warehouses$.pipe(map((locations) => this.filterDummyWarehouses(this.selectWarehouses(locations)))),
      hubs$: this.hubs$.pipe(map((locations) => this.filterDummyHubs(this.selectHubs(locations))))
    };
    this.dialogConfig.formData = {...EMPTY_ROLE, user_id: this.userId};
    const dialogRef = DialogService.handleDialog(this.dialogConfig);
    const sub = this.onRoleChange(dialogRef);
    this.unsubscribe(dialogRef, sub);
  }

  selectWarehouses(locations: any[]): any {
     return locations.filter((w: any) => w.location_type === 'Warehouse')
  }

  selectHubs(locations: any[]): any {
    return locations.filter((w: any) => w.location_type === 'Hub')
  }

  filterDummyWarehouses(warehouses: any[]): any {
    return warehouses.filter(({code}: any) => !SUPPLIER.WAREHOUSE.includes(code))
  }

  filterDummyHubs(warehouses: any[]): any {
    return warehouses.filter(({code}: any) => !SUPPLIER.HUB.includes(code))
  }

  onRevoke({item}: any): void {
    this.blockUI.start('Revoking...');
    this.service.revoke(item, this.userId).subscribe(
      () => {this.blockUI.stop(); this.locationService.reset()},
      () => this.blockUI.stop()
    );
  }

  confirm(event: Event) {
    this.confirmationService.confirm({
        target: event.target,
        message: 'Are you sure that you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.onRevoke(event);
        }
    });
  }
  
  unsubscribe(dialogRef: any, subscription: any) {
    dialogRef.afterClosed().subscribe(() => {
      subscription.unsubscribe();
      this.locationService.reset();
    });
  }
  ngOnDestroy(): void {
    this.service.reset();
  }
}
