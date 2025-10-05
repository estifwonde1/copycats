import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Store } from 'src/app/setup/models/store.model';
import { GenericValidator } from 'src/app/shared/validators/generic.validator';
import { PositiveNumberValidatorService } from '../../../../shared/services/positive-number-validator.service';

@Component({
  selector: 'cats-receipt-authorization-form',
  templateUrl: './receipt-authorization-form.component.html',
  styleUrls: ['./receipt-authorization-form.component.scss']
})
export class ReceiptAuthorizationFormComponent implements OnInit {
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
      store_id: [this.data.formData.store_id, Validators.required],
      quantity: [this.data.formData.quantity, [Validators.required, positiveNumberService.positiveNumberValidator()]],
      dispatch_id: [this.data.formData.dispatch_id],
      authorized_by_id: [this.data.formData.authorized_by_id]
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
