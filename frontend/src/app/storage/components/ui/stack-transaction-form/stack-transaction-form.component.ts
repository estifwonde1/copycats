import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { GenericValidator } from '../../../../shared/validators/generic.validator';
import { Stack } from '../../../../floor-plan/models/stack.model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'cats-stack-transaction-form',
  templateUrl: './stack-transaction-form.component.html',
  styleUrls: ['./stack-transaction-form.component.scss']
})
export class StackTransactionFormComponent implements OnInit {
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formClose = new EventEmitter<void>();
  stacks$: Observable<Stack[]>;
  unitOfMeasures$: Observable<any[]>;
  form: UntypedFormGroup;
  displayMessage: { [key: string]: string } = {};

  private genericValidator: GenericValidator;
  private readonly validationMessages: {
    [key: string]: { [key: string]: string };
  };

  constructor(private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.form = this.fb.group({
      id: [this.data.formData.id],
      source_id: [this.data.formData.source_stack_id],
      destination_id: [this.data.formData.destination_id, Validators.required],
      transaction_date: [this.data.formData.transaction_date, Validators.required],
      quantity: [this.data.formData.quantity, Validators.required],
      unit_id: [this.data.formData.unit_id, Validators.required]
    });

    this.validationMessages = {
      destination_id: {
        required: 'Stack is required'
      },
      transaction_date: {
        required: 'Date is required'
      },
      quantity: {
        required: 'Quantity is required',
      },
      unit_id: {
        required: 'Unit is required',
      }
    }
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.stacks$ = this.data.lookupData.stacks$;
    this.unitOfMeasures$ = this.data.lookupData.unitOfMeasures$;
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
