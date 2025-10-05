import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { GenericValidator } from '../../../../shared/validators/generic.validator';
import { DispatchPlan } from '../../../models/dispatch-plan.model';

@Component({
  selector: 'cats-dispatch-plan-form',
  templateUrl: './dispatch-plan-form.component.html',
  styleUrls: ['./dispatch-plan-form.component.scss']
})
export class DispatchPlanFormComponent implements OnInit {
  @Output() formSubmit = new EventEmitter<DispatchPlan>();
  @Output() formClose = new EventEmitter<void>();
  commodities$: Observable<any[]>;
  monthlyPlans$: Observable<any[]>;
  form: UntypedFormGroup;
  displayMessage: { [key: string]: string } = {};
  private genericValidator: GenericValidator;
  private readonly validationMessages: { [key: string]: { [key: string]: string } };

  constructor(private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.commodities$ = this.data.lookupData.commodities$;
      this.monthlyPlans$ = this.data.lookupData.monthlyPlans$;
      this.form = this.fb.group({
        id: data.formData.id,
        reference_no: [data.formData.reference_no, Validators.required],
        dispatchable_id: [data.formData.dispatchable_id],
        dispatchable_type: [data.formData.dispatchable_type],
      });
      
      this.validationMessages = {
        reference_no: {
          required: 'Reference number is required.'
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
     const {dispatchable_id, dispatchable_type, ...rest} = this.form.value;
     const payload = dispatchable_id ? this.form.value : rest;
     this.formSubmit.emit(payload);
  }

  onCancel(): void {
    this.formClose.emit();
  }

}
