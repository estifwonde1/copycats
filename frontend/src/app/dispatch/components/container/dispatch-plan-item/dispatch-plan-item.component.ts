import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlanItemPrintService } from '../../../../dispatch/state/dispatch-plan-item/plan-item-print-service';
import { UnitOfMeasureQuery } from '../../../../dispatch/state/unit-of-measure/unit-of-measure.query';
import { UnitOfMeasureService } from '../../../../dispatch/state/unit-of-measure/unit-of-measure.service';
import { LOCATION_TYPES } from '../../../../setup/constants/location-types';
import { LocationQuery } from '../../../../setup/state/location/location.query';
import { LocationService } from '../../../../setup/state/location/location.sevice';
import { SUPPLIER } from '../../../../shared/constants/supplier-dummy-data.constant';
import { Column } from '../../../../shared/models/column.model';
import { DialogConfig } from '../../../../shared/models/dialog-config.model';
import { DialogService } from '../../../../shared/services/dialog.service';
import { DispatchPlanItem, EMPTY_DISPATCH_PLAN_ITEM } from '../../../models/dispatch-plan-item.model';
import { DispatchPlan } from '../../../models/dispatch-plan.model';
import { CommodityQuery } from '../../../state/commodity/commodity.query';
import { CommodityService } from '../../../state/commodity/commodity.service';
import { DispatchPlanItemQuery } from '../../../state/dispatch-plan-item/dispatch-plan-item.query';
import { DispatchPlanItemService } from '../../../state/dispatch-plan-item/dispatch-plan-item.sevice';
import { DispatchPlanQuery } from '../../../state/dispatch-plan/dispatch-plan.query';
import { DispatchPlanService } from '../../../state/dispatch-plan/dispatch-plan.sevice';
import { AuthorizationFormComponent } from '../../ui/authorization-form/authorization-form.component';
import { DispatchPlanItemFormComponent } from '../../ui/dispatch-plan-item-form/dispatch-plan-item-form.component';
import { ReceiptAuthorizationFormComponent } from '../../ui/receipt-authorization-form/receipt-authorization-form.component';

@Component({
  selector: 'cats-dispatch-plan-item',
  templateUrl: './dispatch-plan-item.component.html',
  styleUrls: ['./dispatch-plan-item.component.scss']
})
export class DispatchPlanItemComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI: NgBlockUI;
  dispatchPlanId: number = +this.route.snapshot.params['dispatch_plan_id'];
  selectedDispatchPlan: DispatchPlan;
  dispatchPlan$: Observable<DispatchPlan> = this.dispatchPlanQuery.selectEntity(this.dispatchPlanId);
  dispatchPlans$: Observable<DispatchPlan[]> = this.dispatchPlanQuery.selectAll();
  dispatchPlanItems$: Observable<DispatchPlanItem[]> = this.query.selectAll();
  loading$: Observable<boolean> = this.query.selectLoading();
  locationTypes: string[] = LOCATION_TYPES;
  sourceLocations$: Observable<any[]> = this.locationQuery.selectSourceLocation();
  destinationLocations$: Observable<any[]> = this.locationQuery.selectDestinationLocation();
  dispatchPlanStatus: string;
  commodities$: Observable<any[]> = this.commodityQuery.selectAll();
  unitOfMeasures$ = this.unitOfMeasureQuery.selectAll();

  sourceType: string = this.route.snapshot.params['source_type'];

  dispatchPlanQuantity: number;
  requisitionNumber: string;
  totalQuantity = 0;
  currentdispatchPlanItemQuantity$: Observable<number> = this.query.selectCurrentQuantity();

  items: MenuItem[] = [
    {label: 'Dispatch Plans', routerLink: '../../' },
    {label: 'Dispatch Plan Items' }
  ];

  columns: Column[] = [
    { name: 'reference_no', label: 'Requisition Number' },
    { name: 'source_name', label: 'Source' },
    { name: 'region', label: 'Region' },
    { name: 'zone', label: 'Zone' },
    { name: 'woreda', label: 'Woreda' },
    { name: 'destination_name', label: 'Destination' },
    { name: 'quantity', label: 'Quantity' },
    { name: 'unit_abbreviation', label: 'Unit of measurement' },
    { name: 'commodity_name', label: 'Commodity Name' },
    { name: 'commodity_batch_no', label: 'Commodity Batch No' }
  ];

  caption = 'Dispatch Plan Items';

  actions: any[] = [
    { icon: 'add_circle', label: 'New' },
    { icon: 'done_outline', label: 'Approve Dispatch Plan', disabled: false}
  ];

  tableActions: any[] = [
    { icon: 'edit', color: 'warn', tooltip: 'Edit'},
    { icon: 'description', color: 'success', tooltip: 'Issue Authorization Form'},
    { icon: 'assignment', color: 'success', tooltip: 'Receipt Authorization Form'},
  ];

  dialogConfig: DialogConfig = {
    width: '800px',
    formComponent: DispatchPlanItemFormComponent,
    dialog: this.dialog,
    service: this.service,
    parentComponent: this
  } as DialogConfig;

  constructor(private route: ActivatedRoute,
              private dispatchPlanQuery: DispatchPlanQuery,
              private dispatchPlanService: DispatchPlanService,
              private query: DispatchPlanItemQuery,
              private service: DispatchPlanItemService,
              private dialog: MatDialog,
              private locationService: LocationService,
              private locationQuery: LocationQuery,
              private router: Router,
              private confirmationService: ConfirmationService,
              private commodityService: CommodityService,
              private commodityQuery: CommodityQuery,
              private unitOfMeasureService: UnitOfMeasureService,
              private unitOfMeasureQuery: UnitOfMeasureQuery,
              private planItemPrintService: PlanItemPrintService) { }

  ngOnInit(): void {
    this.setupLoader();
    this.loadDispatchPlan();
    this.loadDispatchPlanItems();
    this.loadDispatchPlans();
    this.loadCommodities();
    this.loadUnitOfMeasures();
  }

  loadSourceLocations(locationType: string): void {
    this.blockUI.start('Loading...');
    this.locationService.getSourceLocation(locationType).subscribe(()=> this.blockUI.stop(), () => this.blockUI.stop());
  }

  loadDestinationLocations(locationType: string): void {
    this.blockUI.start('Loading...');
    this.locationService.getDestinationLocation(locationType).subscribe(()=> this.blockUI.stop(), () => this.blockUI.stop());
  }

  loadUnitOfMeasures(): void {
    this.blockUI.start('Loading...');
    this.unitOfMeasureService.get().subscribe(
      () => this.blockUI.stop(), () => this.blockUI.stop()
    )
  }

  setupLoader() {
    this.loading$.subscribe(loading => {
      if (loading) {
        this.blockUI.start('Loading ...');
      } else {
        this.blockUI.stop();
      }
    });
  }

  loadCommodities(): void {
    this.commodityService.reset();
    const params: any = { status_eq: 'Approved' };
    this.commodityService.filter(params).subscribe();
  }

  loadDispatchPlans(): void {
    if (!this.dispatchPlanId) {
      this.dispatchPlanService.filterByStatus('Approved').subscribe();
      this.tableActions.shift();
    }
  }

  loadDispatchPlan(): void {
    if (this.dispatchPlanId) {
      if (!this.dispatchPlanQuery.hasEntity(this.dispatchPlanId)) {
        this.blockUI.start('Loading...');
        this.dispatchPlanService.getOne(this.dispatchPlanId).subscribe(({success, data}: any) => {
          this.blockUI.stop();
            if (success) {
              this.dispatchPlanQuantity = data?.request_id ? data?.request_quantity: data?.commodity_quantity;
              this.dispatchPlanService.addOneToStore(data);
            }
          },() => this.blockUI.stop()
        )
      } else {
        this.dispatchPlanQuantity = this.dispatchPlanQuery.getEntity(this.dispatchPlanId)?.quantity;
      }
    }
  }

  toggleActionButtonState(dispatchPlanId: any): void {
    this.dispatchPlanQuery.selectEntity(dispatchPlanId).subscribe((dispatchPlan: DispatchPlan)=>{
      this.dispatchPlanStatus = dispatchPlan?.status;
      if (dispatchPlan?.status !== 'Draft') {
        this.actions[0].disabled = true;
        this.actions[1].disabled = true;
        this.tableActions[0].disable = () => true;
      } else {
        this.actions[0].disabled = false;
        this.actions[1].disabled = false;
        this.tableActions[0].disable = () => false;
      }
    });
  }

  loadDispatchPlanItems(): void {
    this.route.params.subscribe(params => {
      this.dispatchPlanId = +params.dispatch_plan_id;
      this.getDispatchPlanItems(this.dispatchPlanId);
      this.toggleActionButtonState(this.dispatchPlanId);
    });
  }

  getDispatchPlanItems(dispatchPlanId: any): void {
    this.blockUI.start('Loading...');
    this.service.get(dispatchPlanId).subscribe(
      () => this.blockUI.stop(), () => this.blockUI.stop()
    );
  }

  setTotalQuantity(): void {
    this.dispatchPlanItems$.subscribe(res => {
      this.totalQuantity = res.map(r => r.quantity).reduce((prev, curr) => prev += curr, 0);
    });
  }

  onToolbarActionClick(event: any) {
    switch(event.label) {
      case 'Approve Dispatch Plan':
        this.confirm(this.dispatchPlanId);
        break;
      case 'New':
        this.onCreate();
        break;
      default:
        break;
    }
  }

  onClick(event: any) {
    switch (event.type) {
      case 'edit':
        this.onEdit(event.item);
        break;
      case 'pending_actions':
        this.onReceiptAuthorization(event.item);
        break;
      case 'description':
        this.onIssueAuthForm(event.item);
        break;
      case 'assignment':
        this.onRecieptAuthForm(event.item);
        break;
      default:
        break;
    }
  }

  onIssueAuthForm(item: any): void {
    const dialogRef = this.dialog.open(AuthorizationFormComponent, {
      disableClose: true,
      width: '1000px',
    });
    const sub1 = (dialogRef.componentInstance as any).formSubmit.subscribe((data: any) => {
      const payload = {
        ...data, 
        id: item.id,
        authorization_type: 'Issue'
      };
      this.service.downloadHubAuthorization(payload).subscribe((data: any) => {
        const blob = new Blob([data]);
        const url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.href = url;
        a.download = 'issue_authorization_template.docx';
        a.click();
        dialogRef.close();
      })
    });
    const closeSub = (dialogRef.componentInstance as any).formClose.subscribe(() => dialogRef.close());
    dialogRef.afterClosed().subscribe(() => {
      sub1.unsubscribe();
      closeSub.unsubscribe();
    })
  }

  onRecieptAuthForm(item: any) {
    const dialogRef = this.dialog.open(ReceiptAuthorizationFormComponent, {
      disableClose: true,
      width: '1000px'
    });

    const sub1 = (dialogRef.componentInstance as any).formSubmit.subscribe((data: any) => {
      const payload = {
        ...data, 
        id: item.id,
        authorization_type: 'Receipt'
      };
      this.service.downloadHubAuthorization(payload).subscribe((data: any) => {
        const blob = new Blob([data]);
        const url = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.href = url;
        a.download = 'receipt_authorization_template.docx';
        a.click();
        dialogRef.close();
      })
    });
    const closeSub = (dialogRef.componentInstance as any).formClose.subscribe(() => dialogRef.close());

    dialogRef.afterClosed().subscribe(() => {
      sub1.unsubscribe();
      closeSub.unsubscribe();
    })
  }

  confirm(id: any) {
    this.confirmationService.confirm({
        message: 'Are you sure that you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.onApprove(id);
        }
    });
  }

  onApprove(id: any) {
    this.blockUI.start('Loading...');
    this.dispatchPlanService.approve(id).subscribe(
      (_: any) => this.blockUI.stop(), () => this.blockUI.stop()
    );
  }

  onReceiptAuthorization({ id }: DispatchPlan): void {
    this.router.navigate([id], {relativeTo: this.route});
  }

  onDispatchPlanChange() {
    this.getDispatchPlanItems(this.selectedDispatchPlan.id);
  }
  onCreate(): void {
    this.setTotalQuantity();
    this.dialogConfig.title = 'Add New Dispatch Plan Item';
    this.dialogConfig.lookupData = {
      locationTypes: this.locationTypes,
      sourceLocations$: this.sourceLocations$.pipe(map((locations: any[]) => this.filterDummyLocations(locations))),
      destinationLocations$: this.destinationLocations$.pipe(map((locations: any[]) => this.filterDummyLocations(locations))),
      maximumQuantity: this.dispatchPlanQuantity - this.totalQuantity,
      commodities$: this.commodities$,
      unitOfMeasures$: this.unitOfMeasures$
    };
    this.dialogConfig.formData = {
      ...EMPTY_DISPATCH_PLAN_ITEM,
      dispatch_plan_id: this.dispatchPlanId,
    };
    const dialogRef = DialogService.handleDialog(this.dialogConfig);
    const sourceLocationSub = this.handleSourceLocationTypeChange(dialogRef);
    const destinationLocationSub = this.handleDestinationLocationTypeChange(dialogRef);
    this.unsubscribeOpenSub(dialogRef, [sourceLocationSub, destinationLocationSub]);
  }

  onEdit(dispatchPlanItem: DispatchPlanItem) {
    this.setTotalQuantity();
    this.loadSourceLocations(dispatchPlanItem.source_location_type);
    this.loadDestinationLocations(dispatchPlanItem.destination_location_type);
    this.dialogConfig.title = 'Edit Dispatch Plan Item';
    this.dialogConfig.lookupData = {
      locationTypes: this.locationTypes,
      sourceLocations$: this.sourceLocations$.pipe(map((locations: any[]) => this.filterDummyLocations(locations))),
      destinationLocations$: this.destinationLocations$.pipe(map((locations: any[]) => this.filterDummyLocations(locations))),
      maximumQuantity: this.dispatchPlanQuantity - this.totalQuantity + dispatchPlanItem.quantity,
      commodities$: this.commodities$,
      unitOfMeasures$: this.unitOfMeasures$
    };
    this.dialogConfig.formData = {...dispatchPlanItem, dispatch_plan_id: this.dispatchPlanId};
    const dialogRef = DialogService.handleDialog(this.dialogConfig);
    const sourceLocationSub = this.handleSourceLocationTypeChange(dialogRef);
    const destinationLocationSub = this.handleDestinationLocationTypeChange(dialogRef);
    this.unsubscribeOpenSub(dialogRef, [sourceLocationSub, destinationLocationSub]);
  }

  filterDummyLocations(locations: any[]): any {
    return locations?.filter(({code}: any) => !Object.values(SUPPLIER).includes(code))
  }

  handleSourceLocationTypeChange(dialogRef: any): any {
    return (dialogRef.componentInstance as any).sourceLocationTypeSelected.subscribe((data: any) => {
      this.loadSourceLocations(data);
    });
  }

  handleDestinationLocationTypeChange(dialogRef: any): any {
    return (dialogRef.componentInstance as any).destinationLocationTypeSelected.subscribe((data: any) => {
      this.loadDestinationLocations(data);
    });
  }

  unsubscribeOpenSub(dialogRef: any, subscriptions: any[]): void {
    dialogRef.afterClosed().subscribe(() => {
      subscriptions.forEach((sub) => sub.unsubscribe());
    });
  }

  ngOnDestroy(): void {
    this.dispatchPlanService.reset();
  }

  onPrintRequisition() {
    const dispatchPlan = this.dispatchPlanQuery.getEntity(this.dispatchPlanId);
    this.planItemPrintService.printRRD(this.requisitionNumber, dispatchPlan.reference_no);
  }

  onPrintRequisitionInExcel() {
    const dispatchPlan = this.dispatchPlanQuery.getEntity(this.dispatchPlanId);
    this.planItemPrintService.printRRDInExcel(this.requisitionNumber, dispatchPlan.reference_no);
  }

}
