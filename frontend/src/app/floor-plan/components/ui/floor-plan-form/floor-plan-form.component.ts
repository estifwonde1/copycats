import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { COMMODITY_STATUS } from '../../../../shared/constants/commodity-status.constant';
import { GenericValidator } from '../../../../shared/validators/generic.validator';

@Component({
  selector: 'cats-floor-plan-form',
  templateUrl: './floor-plan-form.component.html',
  styleUrls: ['./floor-plan-form.component.scss']
})
export class FloorPlanFormComponent implements OnInit {
  @Output() formClose = new EventEmitter<void>();
  @Output() formSubmit = new EventEmitter<any>();
  form: UntypedFormGroup;
  commodityStatuses: string[] = COMMODITY_STATUS;
  maximumLength: number;
  maximumWidth: number;
  maximumHeight: number;

  displayMessage: { [key: string]: string } = {};
  private genericValidator: GenericValidator;
  private readonly validationMessages: { [key: string]: { [key: string]: string } };

  constructor(private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.maximumLength = this.data.lookupData.maximumLength;
      this.maximumWidth = this.data.lookupData.maximumWidth;
      this.maximumHeight = this.data.lookupData.maximumHeight;
    this.form = this.fb.group({
      id: [data.formData.id],
      code: [data.formData.code, Validators.required],
      start_x: [data.formData.start_x, [Validators.required, Validators.min(0)]],
      start_y: [data.formData.start_y, [Validators.required, Validators.min(0)]],
      width: [data.formData.width, [Validators.required, Validators.min(0), Validators.max(this.maximumWidth)]],
      height: [data.formData.height, [Validators.required, Validators.min(0), Validators.max(this.maximumHeight)]],
      length: [data.formData.length, [Validators.required, Validators.min(0), Validators.max(this.maximumLength)]],
      store_id: [data.formData.store_id],
      commodity_id: [data.formData.commodity_id],
      commodity_status: [data.formData.commodity_status, [Validators.required]],
      unit_id: [data.formData.unit_id]
    });

    this.validationMessages = {
      code: {
        required: 'Code is required.'
      },
      start_x: {
        required: 'Start X is required.',
        min: 'Minimum value is 0.'
      },
      start_y: {
        required: 'Start Y is required.',
        min: 'Minimum value is 0.'
      },
      width: {
        required: 'Width is required.',
        min: 'Minimum value is 0.',
        max: `${this.maximumWidth} is the maximum width.`
      },
      height: {
        required: 'Height is required.',
        min: 'Minimum value is 0.',
        max: `${this.maximumHeight} is the maximum height.`
      },
      length: {
        required: 'Length is required.',
        max: `${this.maximumLength} is the maximum length.`,
        min: 'Minimum value is 0.'
      },
      commodity_status: {
        required: 'Commodity status is required.',
      },
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

  onDiscard(): void {
    this.formClose.emit();
  }

  onSave(): void {
    this.formSubmit.emit(this.form.value);
  }

}
