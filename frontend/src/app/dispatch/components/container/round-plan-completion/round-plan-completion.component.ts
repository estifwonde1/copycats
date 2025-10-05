import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ConfirmationService } from 'primeng/api';
import { Observable } from 'rxjs';
import { MonthlyPlanQuery } from '../../../../dispatch/state/monthly-plan/monthly-plan.query';
import { MonthlyPlanService } from '../../../../dispatch/state/monthly-plan/monthly-plan.service';
import { RoundPlan } from '../../../../distribution-management/model/round-plan.model';
import { Column } from '../../../../shared/models/column.model';

@Component({
  selector: 'cats-round-plan-completion',
  templateUrl: './round-plan-completion.component.html',
  styleUrls: ['./round-plan-completion.component.scss']
})
export class RoundPlanCompletionComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  roundPlans$: Observable<RoundPlan[]> = this.query.selectAll();

  columns: Column[] = [
    { name: 'reference_no', label: 'Reference' },
    { name: 'program_code', label: 'Program'},
    { name: 'region_name', label: 'Region'},
    { name: 'rounds', label: 'Rounds'},
    { name: 'plan_reference_no', label: 'Plan'},
    { name: 'status', label: 'Status' }
  ];

  caption = 'Round Plans';

  tableActions = [
    { icon: 'done_outline', color: 'warn', tooltip: 'Complete' },
  ];

  constructor(private service: MonthlyPlanService,
              private query: MonthlyPlanQuery,
              private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.loadMonthlyPlans();
  }

  loadMonthlyPlans(): void {
    this.blockUI.start('Loading...');
    this.service.reset();
    const params: any = { status_eq: 'In Progress' };
    this.service.filter(params).subscribe(
      (_: any) => this.blockUI.stop(), () => this.blockUI.stop()
    );
  }

  onClick(event: any): void {
    switch (event.type) {
      case 'done_outline':
        this.confirm(event.item, this.onCompleteRoundPlan.bind(this));
        break;
      default:
        break;
    }
  }

  confirm(id: RoundPlan, acceptFunc: any) {
    this.confirmationService.confirm({
        message: 'Are you sure you want to complete round?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            acceptFunc(id);
        }
    });
  }

  onCompleteRoundPlan(item: any) {
    this.blockUI.start('Completing...');
    this.service.complete(item.id, {...item, status: 'Completed'}).subscribe(
      (_:any) => this.blockUI.stop(), () => this.blockUI.stop()
    )
  }
}
