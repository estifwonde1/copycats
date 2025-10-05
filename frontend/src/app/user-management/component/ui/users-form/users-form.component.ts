import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { rest } from 'lodash';
import { User } from '../../../../auth/models/user.model';
import { GenericValidator } from '../../../../shared/validators/generic.validator';

@Component({
  selector: 'cats-users-form',
  templateUrl: './users-form.component.html',
  styleUrls: ['./users-form.component.scss']
})
export class UsersFormComponent implements OnInit {
  @Output() formSubmit = new EventEmitter<User>();
  @Output() formClose = new EventEmitter<void>();
  hide = true;
  form: UntypedFormGroup;
  displayMessage: { [key: string]: string } = {};
  private genericValidator: GenericValidator;
  private readonly validationMessages: { [key: string]: { [key: string]: string } };
  
  constructor(private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.form = this.fb.group({
        id: data.formData.id,
        first_name: [data.formData.first_name, Validators.required],
        last_name: [data.formData.last_name, Validators.required],
        phone_number: [data.formData.phone_number, [
          Validators.required,
          Validators.pattern(
            /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
          ),
        ]],
        email: [data.formData.email, [Validators.required, Validators.email]],
        application_prefix: data.formData.application_prefix,
        password: [''],
        password_confirmation: ''
      },
      { validator: this.checkPasswords });

      this.validationMessages = {
        first_name: {
          required: 'First name is required.'
        },
        last_name: {
          required: 'Last name is required.'
        },
        phone_number: {
          required: 'Phone number is required.',
          pattern: 'Invalid phone number format.'
        },
        email: {
          required: 'Email is required.',
          email: 'Invalid email format.'
        },
        password: {
          required: 'Password id required',
          notSame: 'Password does not match.',
          minlength: 'Password should be at least 6 characters.'
        },
        password_confirmation: {
          notSame: 'Password does not match.'
        }
      }
      this.genericValidator = new GenericValidator(this.validationMessages);
     }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(
      () => this.displayMessage = this.genericValidator.processMessages(this.form)
    );
  }

  onPasswordInput() {
    if (this.form.hasError('notSame') && !this.form.value.id) {
      this.form.controls.password_confirmation.setErrors({
        notSame: true,
      });
    } else {
      this.form.controls.password_confirmation.setErrors(null);
    }
  }

  checkPasswords(form: UntypedFormGroup) {
    const pass = form.get('password').value;
    const confirmPass = form.get('password_confirmation').value;
    return pass === confirmPass ? null : { notSame: true };
  }

  blur(): void {
    this.displayMessage = this.genericValidator.processMessages(this.form);
  }

  onSubmit(): void {
    const {password, ...rest} = this.form.value;
    const payload = rest.id ? rest : this.form.value;
    this.formSubmit.emit(payload);
  }

  onCancel(): void {
    this.formClose.emit();
  }

}
