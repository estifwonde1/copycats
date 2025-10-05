import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { LocationQuery } from '../../../../setup/state/location/location.query';
import { LocationService } from '../../../../setup/state/location/location.sevice';
import { Location } from '../../../../setup/models/location.model';
import { FreespaceReportService } from '../../../../space-availability/state/freespace-report/freespace-report.service';
import { StoreService } from '../../../../setup/state/store/store.sevice';
import { StoreQuery } from '../../../../setup/state/store/store.query';
import { TreeNode } from 'primeng/api';
import { LocationStore } from '../../../../setup/state/location/location.store';
import { Observable } from 'rxjs';

@Component({
  selector: 'cats-freespace-report',
  templateUrl: './freespace-report.component.html',
  styleUrls: ['./freespace-report.component.scss']
})
export class FreespaceReportComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  hubs$: Observable<Location[]>;
  warehouses$: Observable<Location[]>;
  stores$ = this.storeQuery.selectAll();
  selectedHub: any;
  selectedWarehouse: any;
  selectedStore: any;
  freeSpaces: TreeNode[];

  constructor(private service: FreespaceReportService,
              private locationService: LocationService,
              private locationQuery: LocationQuery,
              private locationStore: LocationStore,
              private storeService: StoreService,
              private storeQuery: StoreQuery) { }

  ngOnInit(): void {    
    this.blockUI.start('Loading...');
    this.locationService.get('Hub').subscribe(
      (_: any) => { 
        this.blockUI.stop();
        this.hubs$ = this.locationQuery.selectHubs();
      },
      () => this.blockUI.stop()
    );
  }

  onHubChange(event: any) {
    this.blockUI.start('Loading...');
    this.locationService.get('Warehouse', this.selectedHub.id).subscribe(
      (_: any) => {
        this.blockUI.stop()
        this.warehouses$ = this.locationQuery.selectByLocationType('Warehouse', this.selectedHub.id);
      }, () => this.blockUI.stop()
    );
  }

  onWarehouseChange(event: any) {
    this.selectedStore = null;
    this.blockUI.start('Loading...');
    this.storeService.get(this.selectedWarehouse.id).subscribe(
      () => this.blockUI.stop(), () => this.blockUI.stop()
    );
  }

  filterStoreFreespace() {
    const url = `cats_core/stores/${this.selectedStore.id}/space`;
    this.blockUI.start('Loading...');
    this.service.get(url).subscribe(
      (result: any) => {
        this.blockUI.stop();
        this.convertToTree(result.data);
      },
      () => this.blockUI.stop()
    );
  }

  filterHubFreespace() {
    const url = `cats_core/hubs/${this.selectedHub.id}/space`;
    this.blockUI.start('Loading...');
    this.service.get(url).subscribe(
      (result: any) => {
        this.blockUI.stop();
        this.convertToTree(result.data);
      },
      () => this.blockUI.stop()
    );
  }

  filterWarehouseFreespace() {
    const url = `cats_core/warehouses/${this.selectedWarehouse.id}/space`;
    this.blockUI.start('Loading...');
    this.service.get(url).subscribe(
      (result: any) => {
        this.blockUI.stop();
        this.convertToTree(result.data);
      },
      () => this.blockUI.stop()
    );
  }

  convertToTree(data: any) {
    const tree: any[] = []
    const parent = {data: { code: data.code, name: data.name, freespace: data.total_space } };
    tree.push(parent);
    this.constructSubtree(data, parent);
    this.freeSpaces = tree;
  }

  constructSubtree(node: any, parent: any) {
    if('details' in node) {
      node.details.forEach((child: any) => {
        const newNode =  { data: { code: child.code, name: child.name,freespace: child.total_space } };
        if('children' in parent) {
          parent.children.push(newNode);
        } else {
          parent['children'] = [newNode];
        }
        this.constructSubtree(child, newNode);
      });
    }
  }

  onFilterClick() {
    if(this.selectedStore) {
      this.filterStoreFreespace();
    } else if(this.selectedWarehouse) {
      this.filterWarehouseFreespace();
    } else {
      this.filterHubFreespace();
    }
  }

}
