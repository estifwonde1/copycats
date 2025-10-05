import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Store } from '../../../../setup/models/store.model';
import { GenericValidator } from '../../../../shared/validators/generic.validator';
import { PositiveNumberValidatorService } from '../../../../shared/services/positive-number-validator.service';

@Component({
  selector: 'cats-hub-authorization-form',
  templateUrl: './hub-authorization-form.component.html',
  styleUrls: ['./hub-authorization-form.component.scss']
})
export class HubAuthorizationFormComponent implements OnInit {
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formClose = new EventEmitter<void>();
  stores$: Observable<Store[]>;
  
  form: UntypedFormGroup;
  displayMessage: { [key: string]: string } = {};

  private genericValidator: GenericValidator;
  private readonly validationMessages: {
    [key: string]: { [key: string]: string };
  };

  constructor(private fb: UntypedFormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private positiveNumberService:PositiveNumberValidatorService) {
    this.form = this.fb.group({
      id: [this.data.formData.id],
      dispatch_plan_item_id: [this.data.formData.dispatch_plan_item_id, Validators.required],
      store_id: [this.data.formData.store_id, Validators.required],
      quantity: [this.data.formData.quantity, [Validators.required, positiveNumberService.positiveNumberValidator()]],
      authorized_by_id: [this.data.formData.authorized_by_id],
      authorization_type: [this.data.formData.authorization_type]
    });

    this.validationMessages = {
      store_id: {
        required: 'Store is required'
      },
      quantity: {
        required: 'Quantity is required',
        invalidNumber: 'Quantity should be greater than zero.'
      }
    }
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.stores$ = this.data.lookupData.stores$;
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(
      () =>
        (this.displayMessage = this.genericValidator.processMessages(this.form))
    );
  }

  blur() {
    this.displayMessage = this.genericValidator.processMessages(this.form);
  }

  onSubmit() {
    this.formSubmit.emit(this.form.value);
  }

  onCancel() {
    this.formClose.emit();
  }

}
