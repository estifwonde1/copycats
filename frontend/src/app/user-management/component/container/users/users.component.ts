import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable } from 'rxjs';
import { EMPTY_USER, User } from '../../../../auth/models/user.model';
import { Column } from '../../../../shared/models/column.model';
import { DialogConfig } from '../../../../shared/models/dialog-config.model';
import { DialogService } from '../../../../shared/services/dialog.service';
import { UserQuery } from '../../../state/user/user.query';
import { UserService } from '../../../state/user/user.sevice';
import { UsersFormComponent } from '../../ui/users-form/users-form.component';

@Component({
  selector: 'cats-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  applicationPrefix = 'CATS-WH';

  caption = 'Users';

  actions: any[] = [
    { icon: 'add', label: 'New'}
  ];

  tableActions = [
    { icon: 'edit', color: 'warn', tooltip: 'Edit'},
    { icon: 'manage_accounts', color: 'success', tooltip: 'Roles'}
  ];

  dialogConfig: DialogConfig = {
    width: '800px',
    formComponent: UsersFormComponent,
    dialog: this.dialog,
    service: this.service,
    parentComponent: this
  } as DialogConfig;

  columns: Column[] = [
    { name: 'first_name', label: 'First Name'},
    { name: 'last_name', label: 'Last Name' },
    { name: 'email', label: 'Email' },
    { name: 'phone_number', label: 'Phone Number' }
  ];

  users$: Observable<User[]> = this.query.selectAll();
  loading$: Observable<boolean> = this.query.selectLoading();
  constructor(private service: UserService,
              private query: UserQuery,
              private dialog: MatDialog,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.blockUI.start('Loading...');
    this.service.get(this.applicationPrefix).subscribe(
      () => this.blockUI.stop(), () => this.blockUI.stop()
    );
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

  onClick(event: any): void {
    switch (event.type) {
      case 'edit':
        this.onEdit(event.item);
        break;
      case 'manage_accounts':
        this.onRoles(event.item);
        break;  
      default:
        break;
    }
  }

  onRoles({id}: User): void {
    this.router.navigate([id, 'roles'], {relativeTo: this.route});
  }

  onCreate(): void {
    this.dialogConfig.title = 'Add New User';
    this.dialogConfig.formData = {...EMPTY_USER, application_prefix: this.applicationPrefix};
    DialogService.handleDialog(this.dialogConfig);
  }

  onEdit(user: any): void {
    this.dialogConfig.title = 'Edit User';
    this.dialogConfig.formData = {...user, application_prefix: this.applicationPrefix};
    DialogService.handleDialog(this.dialogConfig);
  }
}
