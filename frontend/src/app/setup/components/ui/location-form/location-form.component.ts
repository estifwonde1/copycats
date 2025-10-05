import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GenericValidator } from '../../../../shared/validators/generic.validator';
import { Location } from '../../../models/location.model';

@Component({
  selector: 'cats-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss']
})
export class LocationFormComponent implements OnInit {
  @Output() formSubmit = new EventEmitter<Location>();
  @Output() formClose = new EventEmitter<void>();
  form: UntypedFormGroup;
  displayMessage: { [key: string]: string } = {};
  private genericValidator: GenericValidator;
  private readonly validationMessages: { [key: string]: { [key: string]: string } };

  constructor(private fb: UntypedFormBuilder,
              @Inject(MAT_DIALOG_DATA) public data: any) {
                this.form = this.fb.group({
                  id: [data.formData.id],
                  code: [data.formData.code, Validators.required],
                  name: [data.formData.name, Validators.required],
                  description: [data.formData.description],
                  location_type: [data.formData.location_type],
                  parent_id: data.formData.parent_id
                });

                this.validationMessages = {
                  code: {
                    required: 'Code is required.'
                  },
                  name: {
                    required: 'Name is required.'
                  }
                };

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
