import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { GenericValidator } from '../../../../shared/validators/generic.validator';

@Component({
  selector: 'cats-store-form',
  templateUrl: './store-form.component.html',
  styleUrls: ['./store-form.component.scss']
})
export class StoreFormComponent implements OnInit {
  @Output() formSubmit = new EventEmitter<Location>();
  @Output() formClose = new EventEmitter<void>();
  form: UntypedFormGroup;
  displayMessage: { [key: string]: string } = {};
  currentUserWarehouses$: Observable<any[]>;
  
  private genericValidator: GenericValidator;
  private readonly validationMessages: { [key: string]: { [key: string]: string } };

  constructor(private fb: UntypedFormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any) {
                this.currentUserWarehouses$ = data.lookupData?.currentUserWarehouses$;

                this.form = this.fb.group({
                  id: [data.formData.id],
                  code: [data.formData.code, Validators.required],
                  name: [data.formData.name, Validators.required],
                  length: [data.formData.length, [Validators.required, Validators.min(0)]],
                  width: [data.formData.width, [Validators.required, Validators.min(0)]],
                  height: [data.formData.height, [Validators.required, Validators.min(0)]],
                  temporary: [data.formData.temporary],
                  has_gangway: [data.formData.has_gangway],
                  gangway_length: [data.formData.gangway_length, Validators.min(0)],
                  gangway_width: [data.formData.gangway_width, Validators.min(0)],
                  gangway_corner_dist: [data.formData.gangway_corner_dist, Validators.min(0)],
                  warehouse_id: [data.formData.warehouse_id],
                });

                this.validationMessages = {
                  code: {
                    required: 'Code is required.'
                  },
                  name: {
                    required: 'Name is required.'
                  },
                  length: {
                    required: 'Length is required.',
                    min: '0 is minimum value.'
                  },
                  width: {
                    required: 'Width is required.',
                    min: '0 is minimum value.'
                  },
                  height: {
                    required: 'Height is required.',
                    min: '0 is minimum value.'
                  },
                  gangway_length: {
                    min: '0 is minimum value.'
                  },
                  gangway_width: {
                    min: '0 is minimum value.'
                  },
                  gangway_corner_dist: {
                    min: '0 is minimum value.'
                  }
                };

                this.genericValidator = new GenericValidator(this.validationMessages);
              }


  ngOnInit() {
    this.form.valueChanges.subscribe(
      () => this.displayMessage = this.genericValidator.processMessages(this.form)
    );
  }

  hasGangwayChanged() {
    const hasGangwayChecked = this.form.controls.has_gangway.value;
    if (hasGangwayChecked) {
      this.form.controls.gangway_length.setValidators(Validators.required);
      this.form.controls.gangway_width.setValidators(Validators.required);
      this.form.controls.gangway_corner_dist.setValidators(Validators.required);
    } else {
      this.form.controls.gangway_length.clearValidators();
      this.form.controls.gangway_width.setValue(null);
      this.form.controls.gangway_corner_dist.setValue(null);
    }
    this.form.controls.gangway_length.updateValueAndValidity();
    this.form.controls.gangway_width.updateValueAndValidity();
    this.form.controls.gangway_corner_dist.updateValueAndValidity();
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
