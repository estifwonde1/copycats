import { Component, OnDestroy, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable } from 'rxjs';
import { StoreService } from '../../../../setup/state/store/store.sevice';
import { SessionQuery } from '../../../../auth/state/session.query';
import { RoundBeneficiary } from '../../../../distribution-management/model/round-beneficiary.model';
import { RoundPlan } from '../../../../distribution-management/model/round-plan.model';
import { RoundPlanQuery } from '../../../../distribution-management/state/regional-request/round-plan.query';
import { RoundPlanService } from '../../../../distribution-management/state/regional-request/round-plan.service';
import { RoundBeneficiaryQuery } from '../../../../distribution-management/state/round-beneficiary/round-beneficiary.query';
import { RoundBeneficiaryService } from '../../../../distribution-management/state/round-beneficiary/round-beneficiary.service';
import { Column } from '../../../../shared/models/column.model';
import { StoreQuery } from '../../../../setup/state/store/store.query';
import { Store } from '../../../../setup/models/store.model';

@Component({
  selector: 'cats-distribution-checkout',
  templateUrl: './distribution-checkout.component.html',
  styleUrls: ['./distribution-checkout.component.scss']
})
export class DistributionCheckoutComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI: NgBlockUI;
  roundPlans$: Observable<RoundPlan[]> = this.roundPlanQuery.selectAll();
  roundBeneficiaries$: Observable<RoundBeneficiary[]> = this.query.selectAll();
  stores$: Observable<Store[]> = this.storeQuery.selectCurrentUserStores();
  selectedRoundPlan: RoundPlan;
  selectedStore: Store;
  
  columns: Column[] = [
    { name: 'beneficiary_full_name', label: 'Beneficiary' },
    { name: 'commodity_category_name', label: 'Commodity Category', },
    { name: 'quantity', label: 'Quantity', },
    { name: 'unit_abbreviation', label: 'Unit', },
    { name: 'received', label: 'Received', },
  ];

  tableActions = [
    { icon: 'check_circle_outline', color: 'success', tooltip: 'Checkout commodity', },
  ];

  constructor(private service: RoundBeneficiaryService,
              private query: RoundBeneficiaryQuery,
              private roundPlanService: RoundPlanService,
              private roundPlanQuery: RoundPlanQuery,
              private sessionQuery: SessionQuery,
              private storeService: StoreService,
              private storeQuery: StoreQuery) { }

  ngOnInit(): void {
    this.loadRoundPlans();
    this.loadStores();
  }

  loadRoundPlans(): void {
    const params: any = {
      status_in: ['Approved', 'Reserved']
    };
    this.blockUI.start('Loading...');
    this.roundPlanService.filter(params).subscribe(
      () => this.blockUI.stop(), () => this.blockUI.stop()
    );
  }

  loadStores() {
    this.blockUI.start('Loading...');
    this.storeService.getCurrentUserStores(this.sessionQuery.userId).subscribe(
      (_:any) => this.blockUI.stop(), () => this.blockUI.stop()
    );
  }
  
  handleAction(event: any) {
    if(event.type === 'check_circle_outline') {
      this.onCheckoutDistribution(event.item);
    } 
  }

  onCheckoutDistribution({id}: any) {
    this.blockUI.start('Loading...');
    this.service.confirmReceipt(this.selectedRoundPlan.id, [id]).subscribe(
      (_: any) => this.blockUI.stop(), () => this.blockUI.stop()
    );
  }

  onStoreChange() {
    this.blockUI.start('Loading...');
    this.storeService.storeFdp(this.selectedStore.id).subscribe((result: any) => {
      this.blockUI.stop();
      if(result.success) {
       this.loadFdpBeneficiaries(result.data.id)  
      }
    },
    () => this.blockUI.stop());
  }

  loadFdpBeneficiaries(fdpId: any) {
    this.blockUI.start('Loading...');
    this.service.getByRoundPlanAndFdp(this.selectedRoundPlan.id, fdpId).subscribe(
      (_:any) => this.blockUI.stop(), () => this.blockUI.stop()
    );
  }

  onShow(): void {
    this.blockUI.start('Loading...');
    this.service.get(this.selectedRoundPlan.id).subscribe(
      () => this.blockUI.stop(), () => this.blockUI.stop()
    );
  }

  ngOnDestroy(): void {
    this.service.reset();
  }

}
