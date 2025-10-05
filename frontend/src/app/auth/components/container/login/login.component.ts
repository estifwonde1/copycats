import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SessionService } from '../../../state/session.service';
import { UtilService } from '../../../../shared/services/util.service';

@Component({
  selector: 'cats-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private router: Router,
    private service: SessionService,
    private utilService: UtilService
  ) {}

  ngOnInit() {}

  onSubmit(credentials: any) {
    this.blockUI.start('Logging in ...');
    const { email, password } = credentials;
    this.service.login(email, password).subscribe(
      _ => {
        this.blockUI.stop();
        this.router.navigate(['/main']);
      },
      error => {
        this.handleError(error);
        this.blockUI.stop();
      }
    );
  }

  handleError(error: any) {
    if (typeof error === 'string') {
      this.utilService.showMessage('error', 'Error', error);
    } else {
      if (error.status === 400 || error.status === 500) {
        this.utilService.showMessage('error', 'Error', error.error.error);
      } else {
        this.utilService.showMessage('error', 'Error', error.statusText);
      }
    }
  }
}
