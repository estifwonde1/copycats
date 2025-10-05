import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable } from 'rxjs';
import { User } from '../../../../auth/models/user.model';
import { SessionQuery } from '../../../../auth/state/session.query';
import { SessionService } from '../../../../auth/state/session.service';
import { Column } from '../../../../shared/models/column.model';

@Component({
  selector: 'cats-store-assignment',
  templateUrl: './store-assignment.component.html',
  styleUrls: ['./store-assignment.component.scss']
})
export class StoreAssignmentComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  selectedOption: any;
  
  columns: Column[] = [
    { name: 'first_name', label: 'First Name'},
    { name: 'last_name', label: 'Last Name' },
    { name: 'email', label: 'Email' },
    { name: 'phone_number', label: 'Phone Number' }
  ];

  tableActions = [
    { icon: 'home', color: 'success', tooltip: 'Store Assignment', disable: () => this.selectedOption === undefined },
  ];

  users$: Observable<User[]> = this.query.selectUsersByRole();
  options = [
    {label: 'Warehouse Storekeeper', value: 'store_keeper'},
    {label: 'Fdp Storekeeper', value: 'fdp_store_keeper'}
  ]

  constructor(private service: SessionService,
              private query: SessionQuery,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  onClick({item}: any): void {
    this.router.navigate([item?.id, 'stores'], {relativeTo: this.route,
                                               queryParams: { store_type: this.selectedOption.value }});
  }

  onStorekeeperTypeChange(): void {
    this.loadStorekeepers(this.selectedOption.value)    
  }

  loadStorekeepers(storekeeperType: string): void {
    this.blockUI.start('Loading...');
    this.service.getUsersByRole(storekeeperType).subscribe(
      () => this.blockUI.stop(), () => this.blockUI.stop()
    )
  }
}
