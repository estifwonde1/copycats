import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { PositiveNumberValidatorService } from '../../../../shared/services/positive-number-validator.service';
import { Stack } from '../../../../floor-plan/models/stack.model';
import { GenericValidator } from '../../../../shared/validators/generic.validator';

@Component({
  selector: 'cats-dispatch-transaction-form',
  templateUrl: './dispatch-transaction-form.component.html',
  styleUrls: ['./dispatch-transaction-form.component.scss']
})
export class DispatchTransactionFormComponent implements OnInit {
  @Output() formSubmit = new EventEmitter<Location>();
  @Output() formClose = new EventEmitter<void>();

  maximumQuantity: number;
  stacks$: Observable<Stack[]>;
  form: UntypedFormGroup;
  displayMessage: { [key: string]: string } = {};
  private genericValidator: GenericValidator;
  private readonly validationMessages: { [key: string]: { [key: string]: string } };

  constructor(private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private positiveNumberService:PositiveNumberValidatorService) {
      this.stacks$ = this.data.lookupData.stacks$;
      this.maximumQuantity = this.data.lookupData.maximumQuantity;
      this.form = this.fb.group({
        id: [data.formData.id],
        dispatch_authorization_id: data.formData.dispatch_authorization_id,
        source_id: [data.formData.source_id, Validators.required],
        quantity: [data.formData.quantity, [Validators.required, positiveNumberService.positiveNumberValidator(),
           Validators.max(this.maximumQuantity)]],
        transaction_date: [data.formData.transaction_date, [Validators.required,
           Validators.pattern('^[0-9]{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$')]],
        reference_no:[data.formData.reference_no,Validators.required]
      });

      this.validationMessages = {
        quantity: {
          required: 'Quantity is required.',
          max: `${this.maximumQuantity} is the maximum value.`,
          invalidNumber: 'Quantity should be greater than zero.'
        },
        transaction_date: {
          required: 'Transaction date is required.',
          pattern: 'Invalid date format.'
        },
        reference_no: {
          required:'Receipt number is required'
        }
      };
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
    this.formSubmit.emit(this.form.value);
  }

  onCancel(): void {
    this.formClose.emit();
  }

}
