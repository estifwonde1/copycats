import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SUPPLIER } from '../../../../shared/constants/supplier-dummy-data.constant';
import { Column } from '../../../../shared/models/column.model';
import { DialogConfig } from '../../../../shared/models/dialog-config.model';
import { DialogService } from '../../../../shared/services/dialog.service';
import { UtilService } from '../../../../shared/services/util.service';
import { LOCATION_TYPES, LOCATION_TYPES_OBJ } from '../../../constants/location-types';
import { EMPTY_LOCATION, Location } from '../../../models/location.model';
import { OperationService } from '../../../services/operation.service';
import { LocationQuery } from '../../../state/location/location.query';
import { LocationService } from '../../../state/location/location.sevice';
import { LocationFormComponent } from '../../ui/location-form/location-form.component';

@Component({
  selector: 'cats-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  locationTypes: string[] = LOCATION_TYPES;
  allLocationAncestries: any[] = [];
  selectedLocationAncestries: any[] = [];
  selectedLocationType: string;
  parentId: number;
  searchKey: string;

  regions$: Observable<Location[]> = this.query.selectByLocationType('Region');
  zones$: Observable<Location[]> = this.query.selectByLocationType('Zone');
  woredas$: Observable<Location[]> = this.query.selectByLocationType('Woreda');
  fdps$: Observable<Location[]> = this.query.selectByLocationType('Fdp');
  kebeles$: Observable<Location[]> = this.query.selectByLocationType('Kebele');
  hubs$: Observable<Location[]> = this.query.selectByLocationType('Hub');
  warehouses$: Observable<Location[]> = this.query.selectByLocationType('Warehouse');

  columns: Column[] = [
    { name: 'code', label: 'Code' },
    { name: 'name', label: 'Name' },
    { name: 'parent_name', label: 'Parent' },
    { name: 'description', label: 'Description', }
  ];

  caption = 'Locations';

  actions: any[] = [
    { icon: 'add', label: 'New', disabled: true }
  ];

  tableActions = [
    { icon: 'edit', color: 'warn', tooltip: 'Edit'}
  ];

  dialogConfig: DialogConfig = {
    width: '800px',
    formComponent: LocationFormComponent,
    dialog: this.dialog,
    service: this.service,
    parentComponent: this
  } as DialogConfig;

  locations$: Observable<Location[]>;
  loading$: Observable<boolean> = this.query.selectLoading();

  constructor(private dialog: MatDialog,
              public utilService: UtilService,
              private service: LocationService,
              public query: LocationQuery,
              private operationService: OperationService) { }

  ngOnInit(): void {
    this.setLocationAncestries();
  }

  setLocationAncestries(): void {
    this.allLocationAncestries.push(
      {
        options: this.regions$, value: null,
        placeholder: `${this.utilService.titleCase(LOCATION_TYPES_OBJ.REGION)}`,
        changeHandler: this.onRegionChange.bind(this)
      },
      {
        options: this.zones$, value: null,
        placeholder: `${this.utilService.titleCase(LOCATION_TYPES_OBJ.ZONE)}`,
        changeHandler: this.onZoneChange.bind(this)
      },
      {
        options: this.woredas$, value: null,
        placeholder: `${this.utilService.titleCase(LOCATION_TYPES_OBJ.WOREDA)}`,
        changeHandler: this.onWoredaChange.bind(this)
      },
      {
        options: this.fdps$, value: null,
        placeholder: `${this.utilService.titleCase(LOCATION_TYPES_OBJ.FDP)}`,
        changeHandler: this.onFdpChange.bind(this)
      },
      {
        options: this.kebeles$, value: null,
        placeholder: `${this.utilService.titleCase(LOCATION_TYPES_OBJ.KEBELE)}`,
        changeHandler: this.onKebeleChange.bind(this)
      },
      {
        options: this.hubs$, value: null,
        placeholder: `${this.utilService.titleCase(LOCATION_TYPES_OBJ.HUB)}`,
        changeHandler: this.onHubChange.bind(this)
      },
      {
        options: this.warehouses$, value: null,
        placeholder: `${this.utilService.titleCase(LOCATION_TYPES_OBJ.WAREHOUSE)}`
      },
    );
  }

  onLocationTypeChange(selectedLocationType: string): void {
    this.selectedLocationType = selectedLocationType;
    this.resetAllPreviousValues();


    if (this.isRegionStoreEmpty()) {
      this.blockUI.start('Loading...');
      this.service.get(this.utilService.titleCase(LOCATION_TYPES_OBJ.REGION))?.subscribe(
        () => this.blockUI.stop(), () => this.blockUI.stop()
      );
    }
    if (selectedLocationType.toLowerCase() === LOCATION_TYPES_OBJ.REGION.toLowerCase()) {
      this.locations$ = this.query.selectByLocationType(this.utilService.titleCase(LOCATION_TYPES_OBJ.REGION));
    }
    this.changeUIForSelectedLocationType(selectedLocationType);
  }

  changeUIForSelectedLocationType(selectedLocationType: string): void {
    const selectedIndex = this.getSelectedLocationTypeIndex(selectedLocationType);

    this.selectedLocationAncestries = this.getSelectedLocationAncestries(selectedLocationType, selectedIndex);

    this.setCaption(selectedLocationType);

    this.enableCreateAction();
  }

  onRegionChange(value: any): void {
    this.resetOtherSelectedValues(value, 0);
    this.fetchNextAncestry(undefined,value.id);
    this.operationService.setRegionChildren(this, value);
    this.parentId = value.id;
    this.setLocations(this.selectedLocationType, this.parentId);
    this.enableCreateAction();
  }

  onZoneChange(value: any): void {
    this.resetOtherSelectedValues(value, 1);
    this.fetchNextAncestry(undefined,value.id);
    this.operationService.setZoneChildren(this, value);
    this.parentId = value.id;
    this.setLocations(this.selectedLocationType, this.parentId);
    this.enableCreateAction();
  }

  onWoredaChange(value: any): void {
    this.resetOtherSelectedValues(value, 2);
    this.fetchNextAncestry(undefined,value.id);
    this.operationService.setWoredaChildren(this, value);
    this.parentId = value.id;
    this.setLocations(this.selectedLocationType, this.parentId);
    this.enableCreateAction();
  }

  onFdpChange(value: any): void {
    // this.resetOtherSelectedValues(value, 3);
    // this.fetchNextAncestry(undefined,value.id);
    // this.setLocations(this.selectedLocationType, this.parentId);
    // this.enableCreateAction();
  }

  onKebeleChange(value: any): void {
    this.resetOtherSelectedValues(value, 3);
    this.fetchNextAncestry(undefined,value.id);
    this.operationService.setKebeleChildren(this, value);
    this.parentId = value.id;
    this.setLocations(this.selectedLocationType, this.parentId);
    this.enableCreateAction();
  }

  onHubChange(value: any): void {
    this.resetOtherSelectedValues(value, 4);
    this.fetchNextAncestry(undefined,value.id);
    this.operationService.setHubChildren(this, value);
    this.parentId = value.id;
    this.setLocations(this.selectedLocationType, this.parentId);
    this.enableCreateAction();
  }

  enableCreateAction(): void {
    const needParentId = this.selectedLocationType.toLowerCase() === LOCATION_TYPES_OBJ.REGION.toLowerCase() ? true : this.parentId;
    if (needParentId) {
      this.actions[0].disabled = false;
    } else {
      this.actions[0].disabled = true;
    }
  }

  setCaption(selectedLocationType: string): void {
    this.actions[0].label = `New ${this.utilService.titleCase(selectedLocationType)}`;
    this.caption = `${this.utilService.titleCase(selectedLocationType)}s`;
  }

  getSelectedLocationAncestries(selectedLocationType: string, selectedIndex: number): any[] {
    return this.allLocationAncestries.filter(
      (locAnc, index) => (!this.compareLocationType(selectedLocationType, locAnc.placeholder) && index < selectedIndex));
  }

  getSelectedLocationTypeIndex(selectedLocationType: string): number {
    return this.allLocationAncestries.findIndex(
      (allLocAnc: any) => this.compareLocationType(selectedLocationType, allLocAnc.placeholder));
  }

  compareLocationType(selectedLocationType: string, locationAncestryName: string): boolean {
    return locationAncestryName.toLowerCase() === selectedLocationType.toLowerCase();
  }

  fetchNextAncestry(ancestryName?: string, parentId?: number): Observable<any> {
    this.blockUI.start('Loading...');
    this.service.get(ancestryName, parentId).subscribe(
      () => this.blockUI.stop(), () => this.blockUI.stop()
    );
    return this.query.selectByLocationType(ancestryName, parentId);
  }

  setLocations(locationType?: string, parentId?: number): void {
    this.locations$ = this.query.selectByLocationType(this.utilService.titleCase(locationType), parentId);
  }

  isRegionStoreEmpty(): boolean {
    return !this.query.hasEntity((entity: any) =>
    entity.location_type.toLowerCase() === LOCATION_TYPES_OBJ.REGION.toLowerCase());
  }

  resetAllPreviousValues(): void {
    this.allLocationAncestries.forEach((location) => location.value = null);
    this.allLocationAncestries.forEach((location, index) => {if (index > 0) location.options = null});
    this.parentId = null;
    this.locations$ = null;
  }

  resetOtherSelectedValues(value: any, currentIndex: number): void {
    this.selectedLocationAncestries.forEach((sla, index) => {if(value !== sla.value && index > currentIndex) sla.value = null});
  }

  onCreate(): void {
    this.dialogConfig.title = `Add New ${this.utilService.titleCase(this.selectedLocationType)}`;
    this.dialogConfig.formData = {
      ...EMPTY_LOCATION,
      location_type: this.utilService.titleCase(this.selectedLocationType),
      parent_id: this.parentId
    };
    DialogService.handleDialog(this.dialogConfig);
  }

  onEdit(event: any) {
    const location = event?.item;
    this.dialogConfig.title = `Edit ${this.utilService.titleCase(this.selectedLocationType)}`;
    this.dialogConfig.formData = location;
    DialogService.handleDialog(this.dialogConfig);
  }

  searchLocation() {
    const criteria = { code_cont: this.searchKey };
    this.blockUI.start('Searching....');
    this.service.filter(criteria).subscribe(
      (_:any) => {
        this.blockUI.stop();
        this.locations$ = this.query.selectAll();
      },
      () => this.blockUI.stop()
    );
  }

}
