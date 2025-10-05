import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ConfirmationService } from 'primeng/api';
import { Observable } from 'rxjs';
import { UnitConversionQuery } from '../../../../setup/state/unit-conversion/unit-conversion.query';
import { UnitConversionService } from '../../../../setup/state/unit-conversion/unit-conversion.service';
import { environment } from '../../../../../environments/environment';
import { Dispatch, EMPTY_DISPATCH } from '../../../../receipt/models/dispatch.model';
import { DispatchQuery } from '../../../../receipt/state/dispatch/dispatch.query';
import { DispatchService } from '../../../../receipt/state/dispatch/dispatch.sevice';
import { COMMODITY_STATUS } from '../../../../shared/constants/commodity-status.constant';
import { Column } from '../../../../shared/models/column.model';
import { DialogConfig } from '../../../../shared/models/dialog-config.model';
import { DialogService } from '../../../../shared/services/dialog.service';
import { DispatchPlanItem } from '../../../models/dispatch-plan-item.model';
import { DispatchPlanItemQuery } from '../../../state/dispatch-plan-item/dispatch-plan-item.query';
import { DispatchPlanItemService } from '../../../state/dispatch-plan-item/dispatch-plan-item.sevice';
import { DispatchPlanQuery } from '../../../state/dispatch-plan/dispatch-plan.query';
import { DispatchPlanService } from '../../../state/dispatch-plan/dispatch-plan.sevice';
import { TransporterQuery } from '../../../state/transporter/transporter.query';
import { TransporterService } from '../../../state/transporter/transporter.service';
import { UnitOfMeasureQuery } from '../../../state/unit-of-measure/unit-of-measure.query';
import { UnitOfMeasureService } from '../../../state/unit-of-measure/unit-of-measure.service';
import { DispatchFormComponent } from '../../ui/dispatch-form/dispatch-form.component';
import { SessionQuery } from '../../../../auth/state/session.query';
import { RouteService } from '../../../../setup/state/route/route.service';
import { RouteQuery } from '../../../../setup/state/route/route.query';

@Component({
  selector: 'cats-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.scss']
})
export class DispatchComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI: NgBlockUI;
  selectedDispatchPlanItem: any;
  selectedDispatchPlan: any;
  dispatches$: Observable<Dispatch[]> = this.query.selectAll();
  dispatchPlans$: Observable<any[]> = this.dispatchPlanQuery.selectAll();
  transporters$: Observable<any[]> = this.transporterQuery.selectAll();
  dispatchPlanItems$: Observable<DispatchPlanItem[]> = this.dispatchPlanItemQuery.selectDispatchPlanItems();
  currentDispatchQuantity$: Observable<number>;
  unitOfMeasures$ = this.unitOfMeasureQuery.selectAll();

  columns: Column[] = [
    { name: 'reference_no', label: 'Reference' },
    { name: 'quantity', label: 'Quantity' },
    { name: 'unit_abbreviation', label: 'Unit' },
    { name: 'remark', label: 'Remark'},
  ];

  caption = 'Dispatches';

  actions: any[] = [
    { icon: 'add', label: 'New', disabled: true },
  ];

  tableActions = [
    { icon: 'edit', color: 'warn', tooltip: 'Edit', disable: this.cannotEdit}
  ];

  dialogConfig: DialogConfig = {
    width: '800px',
    formComponent: DispatchFormComponent,
    dialog: this.dialog,
    service: this.service,
    parentComponent: this
  } as DialogConfig;

  constructor(private dialog: MatDialog,
              private service: DispatchService,
              private query: DispatchQuery,
              private transporterService: TransporterService,
              private transporterQuery: TransporterQuery,
              private dispatchPlanItemService: DispatchPlanItemService,
              private dispatchPlanItemQuery: DispatchPlanItemQuery,
              private dispatchPlanService: DispatchPlanService,
              private dispatchPlanQuery: DispatchPlanQuery,
              private confirmationService: ConfirmationService,
              private unitOfMeasureService: UnitOfMeasureService,
              private unitOfMeasureQuery: UnitOfMeasureQuery,
              private unitConversionService: UnitConversionService,
              private unitConversionQuery: UnitConversionQuery,
              private sessionQuery: SessionQuery,
              private routeService: RouteService,
              private routeQuery: RouteQuery) { }

  ngOnInit(): void {
    this.loadTransporters();
    this.loadApprovedDispatchPlans();
    this.loadUnitOfMeasures();
    this.loadUnitConversions();
    this.calculateCurrentQuantity();
    this.setTableAction();
    this.setApproverActions();
  }

  calculateCurrentQuantity() {
    this.dispatches$.subscribe((data: any) => {
      if(data.length > 0) {
        this.currentDispatchQuantity$ =
        this.query.selectCurrentQuantity(this.selectedDispatchPlanItem?.unit_id,
           this.unitConversionQuery.getAll());
      }
    });
  }

  loadUnitConversions() {
    this.blockUI.start('Loading...');
    this.unitConversionService.get().subscribe(
      (_:any) => this.blockUI.stop(), () => this.blockUI.stop()
    );
  }

  setTableAction() {
    if(this.sessionQuery.getValue().user.roles.includes('store_keeper')) {
      this.tableActions = [
        { icon: 'not_started', color: 'success', tooltip: 'Start', disable: this.cannotStart }
      ]
    }
  }

  setApproverActions() {
    if(this.sessionQuery.UserRoles?.includes('hub_and_dispatch_approver')) {
      this.tableActions = [
        { icon: 'edit', color: 'warn', tooltip: 'Edit', disable: this.cannotEdit},
        { icon: 'done_outline', color: 'success', tooltip: 'Approve', disable: this.cannotEdit},
        { icon: 'undo', color: 'success', tooltip: 'Revert to draft' } as any,
      ]
    }
  }

  cannotEdit({icon}: any, {dispatch_status}: Dispatch): boolean {
    return (icon === 'edit'||icon==='done_outline') && dispatch_status !== 'Draft';
  }

  cannotStart({icon}: any, {dispatch_status}: Dispatch): boolean {
    return icon === 'not_started' && dispatch_status !== 'Ready to Start';
  }

  loadUnitOfMeasures(): void {
    this.blockUI.start('Loading...');
    this.unitOfMeasureService.get().subscribe(
      () => this.blockUI.stop(), () => this.blockUI.stop()
    )
  }

  loadApprovedDispatchPlans(): void {
    this.sessionQuery.selectUserRoles().subscribe((result: any) => {
      if(result.includes('store_keeper')) {
        const criteria = { dispatch_plan_items_dispatches_dispatch_authorizations_store_id_in:
                           this.sessionQuery.userDetails.stores, status: 'Approved',
                           upstream_eq:	false };
        this.dispatchPlanService.filter(criteria).subscribe();
      } else if(result.includes('hub_manager') ) {
        this.dispatchPlanService.filterByLocation('source', this.sessionQuery.userDetails.hub).subscribe();
      } else {
        this.dispatchPlanService.filterByStatus('Approved').subscribe();
      }
    })
  }

  onClick(event: any): void {
    switch (event.type) {
      case 'edit':
        this.onEdit(event.item);
        break;
      case 'done_outline':
        this.confirm(event.item, this.onApprove.bind(this));
        break;
      case 'not_started':
        this.confirm(event.item, this.onStart.bind(this));
        break;  
      case 'undo':
        this.revertToDraft(event.item);
        break;
      default:
        break;
    }
  }
  
  onCreate(): void {
    this.dialogConfig.title = 'Add New Dispatch';
    this.dialogConfig.lookupData = {
      commodityStatuses: COMMODITY_STATUS,
      transporters$: this.transporters$,
      unitOfMeasures$: this.unitOfMeasures$
    };
    this.dialogConfig.formData = {
      ...EMPTY_DISPATCH,
      dispatch_plan_item_id: this.selectedDispatchPlanItem.id
    };
    DialogService.handleDialog(this.dialogConfig);
  }

  onEdit(dispatch: Dispatch): void {
    this.dialogConfig.title = 'Edit Dispatch';
    this.dialogConfig.lookupData = {
      commodityStatuses: COMMODITY_STATUS,
      transporters$: this.transporters$,
      unitOfMeasures$: this.unitOfMeasures$
    };
    this.dialogConfig.formData = {...dispatch, dispatch_plan_item_id: this.selectedDispatchPlanItem.id};
    DialogService.handleDialog(this.dialogConfig);
  }

  confirm({id}: any, acceptFunc: any) {
    this.confirmationService.confirm({
        message: 'Are you sure that you want to proceed?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            acceptFunc(id);
        }
    });
  }

  onApprove(id: any): void {
    this.blockUI.start('Approving...');
    this.service.approve(id, {dispatch_status: 'Approved'}).subscribe(
      () => this.blockUI.stop(), () => this.blockUI.stop()
    );
  }

  onStart(id: any): void {
    this.blockUI.start('Starting...');
    this.service.start(id, {dispatch_status: 'Started'}).subscribe(
      () => this.blockUI.stop(), () => this.blockUI.stop()
    );
  }

  loadTransporters(): void {
    this.transporterService.get(
      {url: `${environment.apiUrl}/cats_core/transporters`, mapResponseFn: (r: any) => r.data}
      ).subscribe({ next: ()=> this.blockUI.stop(), error: () => this.blockUI.stop()});
  }

  /*loadTransporters(routeId: number) {
    this.blockUI.start('Loading...');
    this.transporterService.winners(routeId).subscribe(
      (_: any) => this.blockUI.stop(),
      () => this.blockUI.stop()
    )
  }*/

  loadDispatchPlanItems(): void {
    this.blockUI.start('Loading...');
    this.dispatchPlanItemService.get(this.selectedDispatchPlan.id).subscribe(
      () => this.blockUI.stop(), () => this.blockUI.stop()
    )
  }

  onDispatchPlanItemChange(): void {
    if(!this.sessionQuery.getValue().user.roles.includes('store_keeper')) {
      this.actions[0].disabled = false;
      this.blockUI.start('Loading...');
      this.service.reset();
      this.service.getByDispatchPlanItem(this.selectedDispatchPlanItem.id).subscribe(
        () => this.blockUI.stop(), () => this.blockUI.stop()
      )
    }
    else {
      this.blockUI.start('Loading...');
      this.service.reset();
      const criteria = { dispatch_authorizations_store_id_in:
                         this.sessionQuery.userDetails.stores, 
                         dispatch_plan_item_id_eq:	this.selectedDispatchPlanItem.id };
      this.service.filter(criteria).subscribe(
        (_:any) => this.blockUI.stop(), () => this.blockUI.stop()
      );
      
    }
    this.loadRoute();
  }

  onDispatchPlanChange(): void {
    this.service.reset();    
    this.loadDispatchPlanItems();
  }

  loadRoute() {
    let routeName = `${this.selectedDispatchPlanItem.source_name} - ${this.selectedDispatchPlanItem.woreda}`;
    this.blockUI.start('Loading...');
    this.routeService.filter({ name_eq: routeName }).subscribe((result: any) => {
      this.blockUI.stop();
      /*if(result.data.length > 0) {
        this.loadTransporters(result.data[0].id);
      }*/
    },
    () => this.blockUI.stop())
  }

  revertToDraft(item: any) {
    this.blockUI.start('Reverting...');
    this.service.revert(item.id).subscribe(
      (_:any) => this.blockUI.stop(),
      () => this.blockUI.stop()
    )
  }

  ngOnDestroy(): void {
    this.service.reset();
  }
}
