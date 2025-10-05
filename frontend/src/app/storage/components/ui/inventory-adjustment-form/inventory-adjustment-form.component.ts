import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Stack } from '../../../../floor-plan/models/stack.model';
import { GenericValidator } from '../../../../shared/validators/generic.validator';

@Component({
  selector: 'cats-inventory-adjustment-form',
  templateUrl: './inventory-adjustment-form.component.html',
  styleUrls: ['./inventory-adjustment-form.component.scss']
})
export class InventoryAdjustmentFormComponent implements OnInit {
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
      hub_id: [this.data.formData.hub_id],
      warehouse_id: [this.data.formData.warehouse_id],
      store_id: [this.data.formData.store_id],
      reference_no: [this.data.formData.reference_no, Validators.required],
      stack_id: [this.data.formData.stack_id, Validators.required],
      quantity: [this.data.formData.quantity, Validators.required],
      unit_id: [this.data.formData.unit_id, Validators.required],
      reason_for_adjustment: [this.data.formData.reason_for_adjustment, Validators.required],
      adjustment_date: [this.data.formData.adjustment_date, Validators.required],
    });

    this.validationMessages = {
      reference_no: {
        required: 'Reference number is required'
      },
      stack_id: {
        required: 'Stack is required'
      },
      quantity: {
        required: 'Quantity is required',
      },
      unit_id: {
        required: 'Unit is required',
      },
      reason_for_adjustment: {
        required: 'Reason for adjustment is required',
      },
      adjustment_date: {
        required: 'Adjustment date is required',
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
