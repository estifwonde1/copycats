import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ConfirmationService } from 'primeng/api';
import { Observable } from 'rxjs';
import { Location } from '../../../../setup/models/location.model';
import { Store } from '../../../../setup/models/store.model';
import { LocationQuery } from '../../../../setup/state/location/location.query';
import { LocationService } from '../../../../setup/state/location/location.sevice';
import { StorekeeperStoresQuery, StoreQuery } from '../../../../setup/state/store/store.query';
import { StoreService } from '../../../../setup/state/store/store.sevice';
import { Column } from '../../../../shared/models/column.model';
import { StoreAssignmentFormComponent } from '../../ui/store-assignment-form/store-assignment-form.component';

@Component({
  selector: 'cats-storekeeper-stores',
  templateUrl: './storekeeper-stores.component.html',
  styleUrls: ['./storekeeper-stores.component.scss']
})
export class StorekeeperStoresComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  storekeeperId: number = +this.route.snapshot.params['id'];
  storeType = this.route.snapshot.queryParams['store_type'];

  columns: Column[] = [
    { name: 'code', label: 'Code' },
    { name: 'name', label: 'Name' },
  ];

  tableActions = [
    { icon: 'clear', color: 'warn', tooltip: 'Unassign'}
  ];

  actions: any[] = [
    { icon: 'add_circle', label: 'Assign To Store' },
  ];

  warehouses$: Observable<Location[]> = this.locationQuery.selectAll();
  storekeeperStores$: Observable<Store[]> = this.query.selectAll();
  stores$: Observable<Store[]> = this.storeQuery.selectAll();
  regions: any[] = [];
  dialogRef: any;

  constructor(private service: StoreService,
              private query: StorekeeperStoresQuery,
              private storeQuery: StoreQuery,
              private route: ActivatedRoute,
              private dialog: MatDialog,
              private locationService: LocationService,
              private locationQuery: LocationQuery,
              private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.loadStorekeeperStores();
    this.loadRegions();
  }

  loadStorekeeperStores(): void {
    this.blockUI.start('Loading...');
    this.service.getStorekeeperStores(this.storekeeperId).subscribe(
      () => this.blockUI.stop(), () => this.blockUI.stop()
    );
  }

  loadStores(warehouseId: any): void {
    this.blockUI.start('Loading...');
    this.service.get(warehouseId).subscribe(
      () => this.blockUI.stop(), () => this.blockUI.stop()
    )
  }

  confirm(event: Event) {
    this.confirmationService.confirm({
        target: event.target,
        message: 'Are you sure that you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.onUnassign(event);
        }
    });
  }

  onUnassign({item}: any): void {
    this.blockUI.start('Loading...');
    const payload = {store_ids: [item.id] };
    this.service.unassignStore(this.storekeeperId, payload).subscribe(
      () => this.blockUI.stop(), () => this.blockUI.stop()
    );
  }

  loadWarehouses(parentId: number): void {
    this.blockUI.start('Loading...');
    this.locationService.get('Warehouse', parentId).subscribe(
      (response: any) => { 
        this.blockUI.stop();
        this.dialogRef.componentInstance.warehouses = response.data;
      }, () => this.blockUI.stop()
    );
  }
  
  onAssign(): void {
    const dialogRef = this.openDialog();
    const sub1 = this.fetchStores(dialogRef);
    const sub2 = this.save(dialogRef);

    this.subscribeToFormEvents(dialogRef);
    dialogRef.componentInstance.regions = this.regions;
    this.dialogRef = dialogRef;

    const closeSub = (dialogRef.componentInstance as any).formClose.subscribe(() => dialogRef.close());
    dialogRef.afterClosed().subscribe(() => {
      closeSub.unsubscribe();
      sub1.unsubscribe();
      sub2.unsubscribe();
    });

  }

  subscribeToFormEvents(dialogRef: any) {
    const regionSub = (dialogRef.componentInstance as any).regionChange.subscribe((regionId: any) => {
       if (this.storeType === 'store_keeper') {
         this.loadHubs(regionId);
       } else {
         this.loadZones(regionId);
       }
      }
    );
    const hubSub = (dialogRef.componentInstance as any).hubChange.subscribe((hId: any) => this.loadWarehouses(hId));
    const zoneSub = (dialogRef.componentInstance as any).zoneChange.subscribe((zId: any) => this.loadWoredas(zId));
    const woredaSub = (dialogRef.componentInstance as any).woredaChange.subscribe((wId: any) => this.loadFdps(wId));
    const fdpSub = (dialogRef.componentInstance as any).fdpChange.subscribe((fId: any) => this.loadWarehouses(fId));
    dialogRef.afterClosed().subscribe(() => {
      regionSub.unsubscribe();
      zoneSub.unsubscribe();
      hubSub.unsubscribe();
      woredaSub.unsubscribe();
      fdpSub.unsubscribe();
    });
  }

  openDialog(): any {
    return this.dialog.open(StoreAssignmentFormComponent, {
      width: '800px',
      disableClose: true,
      data: {
        lookupData: {
          warehouses$: this.warehouses$,
          stores$: this.stores$,
          storekeeperStores$: this.storekeeperStores$,
          storeType: this.storeType
        }
      }
    });
  }

  fetchStores(dialogRef: any): any {
    return (dialogRef.componentInstance as any).fetchStores.subscribe((data: any) => {
      this.loadStores(data); 
    });
  }

  save(dialogRef: any): any {
    return (dialogRef.componentInstance as any).formSubmit.subscribe(({store_id}: any) => {
      const payload = { store_ids: [store_id] };
      this.blockUI.start('Loading...');
      this.service.assignStore(this.storekeeperId, payload).subscribe(
        ({success}: any) => {
          this.blockUI.stop();
          if (success) {
            dialogRef.close();
          }
        }, () => this.blockUI.stop()
      );
    });
  }

  loadRegions() {
    this.blockUI.start('Loading');
    const criteria = { location_type_eq: 'Region' };
    this.locationService.filter(criteria).subscribe((response: any) => {
      this.regions = response.data;
      this.blockUI.stop();
    }, () => this.blockUI.stop());
  }

  loadHubs(regionId: number) {
    this.blockUI.start('Loading');
    this.locationService.get('Hub', regionId).subscribe((response: any) => {
      this.dialogRef.componentInstance.hubs = response.data;
      this.blockUI.stop();
    }, () => this.blockUI.stop());
  }

  loadZones(regionId: number) {
    this.blockUI.start('Loading');
    this.locationService.get('Zone', regionId).subscribe((response: any) => {
      this.dialogRef.componentInstance.zones = response.data;
      this.blockUI.stop();
    }, () => this.blockUI.stop())
  }

  loadWoredas(zoneId: number) {
    this.blockUI.start('Loading');
    this.locationService.get('Woreda', zoneId).subscribe((response: any) => {
      this.dialogRef.componentInstance.woredas = response.data;
      this.blockUI.stop();
    }, () => this.blockUI.stop())
  }

  loadFdps(woredaId: number) {
    this.blockUI.start('Loading');
    this.locationService.get('Fdp', woredaId).subscribe((response: any) => {
      this.dialogRef.componentInstance.fdps = response.data;
      this.blockUI.stop();
    }, () => this.blockUI.stop())
  }
  
}
