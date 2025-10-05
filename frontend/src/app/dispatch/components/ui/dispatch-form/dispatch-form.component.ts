import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { GenericValidator } from '../../../../shared/validators/generic.validator';

@Component({
  selector: 'cats-dispatch-form',
  templateUrl: './dispatch-form.component.html',
  styleUrls: ['./dispatch-form.component.scss']
})
export class DispatchFormComponent implements OnInit {
  @Output() formSubmit = new EventEmitter<Location>();
  @Output() formClose = new EventEmitter<void>();
  transporters$: Observable<any[]>;
  unitOfMeasures: Observable<any[]>;
  commodityStatuses: string[];
  form: UntypedFormGroup;
  displayMessage: { [key: string]: string } = {};
  private genericValidator: GenericValidator;
  private readonly validationMessages: { [key: string]: { [key: string]: string } };
  
  constructor(private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.commodityStatuses = this.data.lookupData.commodityStatuses;
      this.transporters$ = this.data.lookupData.transporters$;
      this.unitOfMeasures = this.data.lookupData.unitOfMeasures$;
      this.form = this.fb.group({
        id: [data.formData.id],
        reference_no: [data.formData.reference_no, Validators.required],
        transporter_id: [data.formData.transporter_id, Validators.required],
        plate_no: [data.formData.plate_no, Validators.required],
        driver_name: [data.formData.driver_name, Validators.required],
        driver_phone: [data.formData.driver_phone, Validators.required],
        commodity_status: data.formData.commodity_status,
        remark: data.formData.remark,
        dispatch_plan_item_id: data.formData.dispatch_plan_item_id,
        unit_id: [this.data.formData.unit_id, Validators.required],
      });


      this.validationMessages = {
        reference_no: {
          required: 'Reference number is required.'
        },
        transporter_id: {
          required: 'Transporter is required.'
        },
        unit_id: {
          required: 'Unit is required.'
        },
        plate_no: {
          required: 'Plate number is required.'
        },
        driver_name: {
          required: 'Driver name is required.'
        },
        driver_phone: {
          required: 'Driver phone is required.'
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
