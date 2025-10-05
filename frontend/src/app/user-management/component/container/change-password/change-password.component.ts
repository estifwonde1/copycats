import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../user-management/state/user/user.sevice';
import { GenericValidator } from '../../../../shared/validators/generic.validator';
import { PasswordConfirmationService }
 from '../../../../user-management/services/password-confirmation.service';
import { SessionQuery } from '../../../../auth/state/session.query';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'cats-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  form: FormGroup;
  displayMessage: { [key: string]: string } = {};
  private genericValidator: GenericValidator;
  private readonly validationMessages: { [key: string]: { [key: string]: string } };
  
  constructor(private fb: FormBuilder,
        private passConfirmService: PasswordConfirmationService,
        private userService: UserService,
        private sessionQuery: SessionQuery) {
      this.form = this.fb.group({
        old_password: ['', [Validators.required, Validators.minLength(7)]],
        password: ['', [Validators.required, Validators.minLength(7)]],
        password_confirmation: ['', [Validators.required, Validators.minLength(7),
                                    this.passConfirmService.passwordValidator()]]
      })

      this.validationMessages = {
        old_password: {
          required: 'Old password is required.',
          minlength: 'Minimum length is 7'
        },
        password: {
          required: 'Password is required.',
          minlength: 'Minimum length is 7'
        },
        password_confirmation: {
          required: 'Confirmation is required.',
          minlength: 'Minimum length is 7',
          passwordMatch: 'Password does not match'
        }
      }

      this.genericValidator = new GenericValidator(this.validationMessages);
     }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(
      () => this.displayMessage = this.genericValidator.processMessages(this.form)
    );
  }

  blur(): void {
    this.displayMessage = this.genericValidator.processMessages(this.form);
  }

  onSubmit(): void {
    let email = this.sessionQuery.email;
    let payload = { ...this.form.value, email };
    this.blockUI.start('Changing password....');
    this.userService.changePassword(payload).subscribe(
      (_:any) => this.blockUI.stop(), () => this.blockUI.stop()
    )
  }

  onCancel(): void {
    this.form.reset();
  }

}
