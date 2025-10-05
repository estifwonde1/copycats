import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PositiveNumberValidatorService } from '../../../../shared/services/positive-number-validator.service';
import { GenericValidator } from '../../../../shared/validators/generic.validator';

@Component({
  selector: 'cats-lost-commodity-form',
  templateUrl: './lost-commodity-form.component.html',
  styleUrls: ['./lost-commodity-form.component.scss']
})
export class LostCommodityFormComponent implements OnInit {
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formClose = new EventEmitter<void>();
  
  form: UntypedFormGroup;
  displayMessage: { [key: string]: string } = {};
  maximumQuantity: number;

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
                  receipt_authorization_id: [this.data.formData.receipt_authorization_id],
                  quantity: [this.data.formData.quantity, [Validators.required, Validators.max(this.maximumQuantity), 
                    positiveNumberService.positiveNumberValidator()]],
                  remark: [this.data.formData.remark]
                });

    this.validationMessages = {
      quantity: {
        required: 'Quantity is required',
        max: `${this.maximumQuantity} is the maximum value.`,
        invalidNumber: 'Quantity should be greater than zero.'
      },
      commodity_status: {
        required: 'Commodity is required'
      }
    }
    this.genericValidator = new GenericValidator(this.validationMessages);
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
