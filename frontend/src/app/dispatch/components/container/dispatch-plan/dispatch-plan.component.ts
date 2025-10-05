import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable } from 'rxjs';
import { DispatchPlanItemService } from '../../../../dispatch/state/dispatch-plan-item/dispatch-plan-item.sevice';
import { UtilService } from '../../../../shared/services/util.service';
import { SessionQuery } from '../../../../auth/state/session.query';
import { LocationQuery } from '../../../../setup/state/location/location.query';
import { LocationService } from '../../../../setup/state/location/location.sevice';
import { Column } from '../../../../shared/models/column.model';
import { DialogConfig } from '../../../../shared/models/dialog-config.model';
import { DialogService } from '../../../../shared/services/dialog.service';
import { DispatchPlan, EMPTY_DISPATCH_PLAN } from '../../../models/dispatch-plan.model';
import { CommodityQuery } from '../../../state/commodity/commodity.query';
import { CommodityService } from '../../../state/commodity/commodity.service';
import { ProspectiveDispatchPlanItemQuery } from '../../../state/dispatch-plan-item/dispatch-plan-item.query';
import { DispatchPlanQuery } from '../../../state/dispatch-plan/dispatch-plan.query';
import { DispatchPlanService } from '../../../state/dispatch-plan/dispatch-plan.sevice';
import { MonthlyPlanQuery } from '../../../state/monthly-plan/monthly-plan.query';
import { MonthlyPlanService } from '../../../state/monthly-plan/monthly-plan.service';
import { DispatchPlanFormComponent } from '../../ui/dispatch-plan-form/dispatch-plan-form.component';
import { GeneratedDispatchPlanItemsComponent } from '../../ui/generated-dispatch-plan-items/generated-dispatch-plan-items.component';
import { DispatchService } from '../../../../receipt/state/dispatch/dispatch.sevice';

@Component({
  selector: 'cats-dispatch-plan',
  templateUrl: './dispatch-plan.component.html',
  styleUrls: ['./dispatch-plan.component.scss']
})
export class DispatchPlanComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  dispatchPlans$: Observable<DispatchPlan[]> = this.query.selectAll();
  monthlyPlans$: Observable<any[]> = this.monthlyPlanQuery.selectApprovedMonthlyPlans();
  sourceLocations$: Observable<any[]> = this.locationQuery.selectSourceLocation();

  columns: Column[] = [
    { name: 'reference_no', label: 'Reference' },
    { name: 'request_reference', label: 'Monthly Plan'},
  ];

  caption = 'Dispatch Plans';

  actions: any[] = [
    { icon: 'add_circle', label: 'New' },
    { icon: 'description', label: 'Generate'}
  ];

  tableActions = [
    { icon: 'edit', color: 'warn', tooltip: 'Edit', disable: this.cannotEdit},
    { icon: 'info', color: 'success', tooltip: 'Items'},
    { icon: 'undo', color: 'success', tooltip: 'Revert to draft state'}
  ];

  dialogConfig: DialogConfig = {
    width: '800px',
    formComponent: DispatchPlanFormComponent,
    dialog: this.dialog,
    service: this.service,
    parentComponent: this
  } as DialogConfig;

  constructor(private service: DispatchPlanService,
              private query: DispatchPlanQuery,
              private dialog: MatDialog,
              private router: Router,
              private route: ActivatedRoute,
              private monthlyPlanService: MonthlyPlanService,
              private monthlyPlanQuery: MonthlyPlanQuery,
              private sessionQuery: SessionQuery,
              private locationService: LocationService,
              private locationQuery: LocationQuery,
              private commodityService: CommodityService,
              private commodityQuery: CommodityQuery,
              private prospectiveDPlanItemQuery: ProspectiveDispatchPlanItemQuery,
              private dpiService: DispatchPlanItemService,
              private dispatchService: DispatchService,
              private utilService: UtilService) { }

  ngOnInit(): void {
    this.loadDispatchPlans();
    this.loadMonthlyPlans();
    
  }

  cannotEdit({icon}: any, {status}: DispatchPlan): boolean {
    const editOrApprove = (icon === 'edit' || icon==='done_outline');
    return editOrApprove && status === 'Approved'
  }

  loadDispatchPlans(): void {
    this.blockUI.start('Loading...');
    this.service.filter({upstream_eq: false}).subscribe(() => this.blockUI.stop(), () => this.blockUI.stop());
  }

  loadMonthlyPlans(): void {
    this.monthlyPlanService.reset();
    const params: any = { status_in: ['Approved', 'In Progress'] };
    this.monthlyPlanService.filter(params).subscribe();
  }

  onClick(event: any): void {
    switch (event.type) {
      case 'edit':
        this.onEdit(event.item);
        break;
      case 'info':
        this.onItems(event.item);
        break;
      case 'undo':
        this.revertToDraft(event.item);
        break;
      default:
        break;
    }
  }

  onGenerate(): void {
    this.loadSourceLocations('Hub');
    this.loadCommodities();
    const dialogRef = this.openGenerateDialog();
    const sub1 = this.onRoundPlanChange(dialogRef);
    const sub2 = this.onApply(dialogRef);
    const sub3 = this.onBulkCreate(dialogRef);
    const sub4 = this.onZoneChange(dialogRef);
    const closeSub = (dialogRef.componentInstance as any).formClose.subscribe(() => dialogRef.close());

    dialogRef.afterClosed().subscribe(() => {
      sub1.unsubscribe();
      sub2.unsubscribe();
      sub3.unsubscribe();
      sub4.unsubscribe();
      closeSub.unsubscribe();
    })
  }

  onZoneChange(dialogRef: any): any {
    (dialogRef.componentInstance as any).zoneChange.subscribe((data: any) => this.loadZone(data));
  }

  onBulkCreate(dialogRef: any): any {
    return (dialogRef.componentInstance as any).formSubmit.subscribe((formPayload: any) => {
        const items = this.prospectiveDPlanItemQuery.getAll().filter((item: any) => item.source_id && item.commodity_id);
        const payload = {
          ...formPayload,
          items
        }
        let reference_nos = items.map((item: any) => item.reference_no);
        let criteria = {reference_no_in: reference_nos};
        this.blockUI.start('Checking duplicate requisition number...');
        this.dpiService.filter(criteria).subscribe((result: any) => {
          this.blockUI.stop();
          if(result.data.length > 0) {
            let duplicated_refs = result.data.map((d: any) => d.reference_no);
            let unique_refs = Array.from(new Set(duplicated_refs))
            this.utilService.showMessage('error', 'Duplicate References', unique_refs.toString());
          } else {
            this.blockUI.start('Saving...');
            this.service.bulkCreate(payload).subscribe(
              (res: any) => {
                this.blockUI.stop();
                if(res.success) {
                  dialogRef.close();
                }
              }, () => this.blockUI.stop()
            )
          }
        },
        () => this.blockUI.stop());
    });
  }

  openGenerateDialog(): any {
    return this.dialog.open(GeneratedDispatchPlanItemsComponent, {
      data: {
        items$: this.prospectiveDPlanItemQuery.selectAll(),
        monthlyPlans$: this.monthlyPlans$,
        sources$: this.sourceLocations$,
        commodities$: this.commodityQuery.selectAll()
      },
      disableClose: true
    })
  }

  onRoundPlanChange(dialogRef: any): any {
    return (dialogRef.componentInstance as any).roundPlanChange.subscribe((roundPlanId: any) => {
      this.service.generate(roundPlanId).subscribe();
    });
  }

  onApply(dialogRef: any): any {
    return (dialogRef.componentInstance as any).apply.subscribe((data: any) => {
      this.service.apply(data.itemIds, {
        reference_no: data.reference_no,
        source_id: data.source_id,
        source_name: data.source_name,
        commodity_id: data.commodity_id,
        commodity_batch_no: data.commodity_batch_no
      })
    })
  }

  onToolbarClick(event: any): void {
    switch(event.label) {
      case 'New':
        this.onCreate();
        break;
      case 'Generate':
        this.onGenerate();
        break;
      default:
        break;
    }
  }

  onCreate(): void {
    this.dialogConfig.title = 'Add New Dispatch Plan';
    this.dialogConfig.lookupData = {
      monthlyPlans$: this.monthlyPlans$
    };
    this.dialogConfig.formData = {
      ...EMPTY_DISPATCH_PLAN,
      dispatchable_type: 'Cats::Core::RoundPlan'
    }
    DialogService.handleDialog(this.dialogConfig);
  }

  onEdit(dispatchPlan: DispatchPlan): void {
    this.dialogConfig.title = 'Edit Dispatch Plan';
    this.dialogConfig.lookupData = {
      monthlyPlans$: this.monthlyPlans$
    };
    this.dialogConfig.formData = {
      ...dispatchPlan,
      dispatchable_type: 'Cats::Core::RoundPlan'
    };
    DialogService.handleDialog(this.dialogConfig);
  }
  
  onItems({id}: DispatchPlan) {
    this.router.navigate([id, 'items'], {relativeTo: this.route});
  }

  loadSourceLocations(locationType: string): void {
    this.blockUI.start('Loading...');
    this.locationService.getSourceLocation(locationType).subscribe(()=> this.blockUI.stop(), () => this.blockUI.stop());
  }

  loadZone(name: string): void {
    this.blockUI.start('Loading...');
    this.locationService.filter(
      { location_type_eq:'Zone', name_cont: name }
      ).subscribe(()=> this.blockUI.stop(), () => this.blockUI.stop());
  }

  loadCommodities(): void {
    this.commodityService.reset();
    const params: any = { status_eq: 'Approved' };
    this.blockUI.start('Loading...');
    this.commodityService.filter(params).subscribe(
      () => this.blockUI.stop(), () => this.blockUI.stop()
    );
  }

  revertToDraft(item: any) {
    this.blockUI.start('Checking...');
    this.dispatchService.filter({dispatch_plan_item_dispatch_plan_id_eq: item.id}).subscribe(
      (result: any) => {
        this.blockUI.stop();
        if(result.data.length === 0) {
          this.blockUI.start('Reverting...');
          this.service.update(item.id, { status: 'Draft'}).subscribe(
            (_:any) => this.blockUI.stop(),
            () => this.blockUI.stop()
          )
        } else {
          this.utilService.showMessage('warn', 'Info', 'Can not revert this dispatch plan');
        }
      }
    )
  }
}
