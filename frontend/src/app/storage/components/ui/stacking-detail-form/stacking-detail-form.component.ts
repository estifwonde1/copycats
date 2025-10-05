import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { PositiveNumberValidatorService } from '../../../../shared/services/positive-number-validator.service';
import { Stack } from '../../../../floor-plan/models/stack.model';
import { GenericValidator } from '../../../../shared/validators/generic.validator';

@Component({
  selector: 'cats-stacking-detail-form',
  templateUrl: './stacking-detail-form.component.html',
  styleUrls: ['./stacking-detail-form.component.scss']
})
export class StackingDetailFormComponent implements OnInit {
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formClose = new EventEmitter<void>();
  stacks: Observable<Stack[]>;
  maximumQuantity: number;
  form: UntypedFormGroup;
  displayMessage: { [key: string]: string } = {};

  private genericValidator: GenericValidator;
  private readonly validationMessages: {
    [key: string]: { [key: string]: string };
  };

  constructor(private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private positiveNumberService:PositiveNumberValidatorService) {
    this.maximumQuantity = this.data.lookupData.maximumQuantity;

    this.form = this.fb.group({
      id: [this.data.formData.id],
      receipt_number: [this.data.formData.receipt_number, Validators.required],
      receipt_authorization_id: [this.data.formData.receipt_authorization_id],
      destination_id: [this.data.formData.destination_id, Validators.required],
      transaction_date: [this.data.formData.transaction_date, [Validators.required,
         Validators.pattern('^[0-9]{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$')]],
      quantity: [this.data.formData.quantity, [Validators.required, positiveNumberService.positiveNumberValidator(),
         Validators.max(this.maximumQuantity)]]
    });

    this.validationMessages = {
      receipt_number: {
        required: 'Receipt number is required'
      },
      destination_id: {
        required: 'Stack is required'
      },
      transaction_date: {
        required: 'Date is required',
        pattern: 'Invalid date format.'
      },
      quantity: {
        required: 'Quantity is required',
        max: `${this.maximumQuantity} is the maximum value.`,
        invalidNumber: 'Quantity should be greater than zero.'
      }
    }
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.stacks = this.data.lookupData.stacks;
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
    this.formSubmit.emit({...this.form.value, unit_of_measure_id: 1});
  }

  onCancel() {
    this.formClose.emit();
  }


}
