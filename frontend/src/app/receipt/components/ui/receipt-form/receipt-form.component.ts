import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PositiveNumberValidatorService } from '../../../../shared/services/positive-number-validator.service';
import { GenericValidator } from '../../../../shared/validators/generic.validator';

@Component({
  selector: 'cats-receipt-form',
  templateUrl: './receipt-form.component.html',
  styleUrls: ['./receipt-form.component.scss']
})
export class ReceiptFormComponent implements OnInit {
  @Output() formSubmit = new EventEmitter<Location>();
  @Output() formClose = new EventEmitter<void>();
  commodityStatuses: string[];
  commodityGrades: string[];
  maximumQuantity: number;
  form: UntypedFormGroup;
  displayMessage: { [key: string]: string } = {};
  private genericValidator: GenericValidator;
  private readonly validationMessages: { [key: string]: { [key: string]: string } };
  

  constructor(private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private positiveNumberService:PositiveNumberValidatorService) {
      this.commodityStatuses = this.data.lookupData.commodityStatuses;
      this.commodityGrades = this.data.lookupData.commodityGrades;
      this.maximumQuantity = this.data.lookupData.maximumQuantity;
      
      this.form = this.fb.group({
        id: data.formData.id,
        receipt_authorization_id: data.formData.receipt_authorization_id,
        quantity: [data.formData.quantity, [Validators.required,positiveNumberService.positiveNumberValidator() ,
           Validators.max(this.maximumQuantity)]],
        commodity_status: data.formData.commodity_status,
        commodity_grade: data.formData.commodity_grade,
        remark: data.formData.remark,
        prepared_by_id: data.formData.prepared_by_id,
        reference_no:[data.formData.reference_no, Validators.required]
      });

      this.validationMessages = {
        quantity: {
          required: 'Quantity is required.',
          max: `${this.maximumQuantity} is the maximum value.`,
          invalidNumber: 'Quantity should be greater than zero.'
        },
        reference_no: {
          required:'Receipt number is required.'
        }
        
      }

      this.genericValidator = new GenericValidator(this.validationMessages);
     }

    ngOnInit() {
      this.form.valueChanges.subscribe(
        () => this.displayMessage = this.genericValidator.processMessages(this.form)
      );
    }
  
    blur(): void {
      this.displayMessage = this.genericValidator.processMessages(this.form);
    }
  
    onSubmit(): void {
      this.formSubmit.emit(this.form.value);
    }
  
    onCancel(): void {
      this.formClose.emit();
    }

}
