import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GenericValidator } from 'src/app/shared/validators/generic.validator';

@Component({
  selector: 'cats-receipt-authorization-form',
  templateUrl: './receipt-authorization-form.component.html',
  styleUrls: ['./receipt-authorization-form.component.scss']
})
export class ReceiptAuthorizationFormComponent implements OnInit {
  @Output() formSubmit = new EventEmitter<Location>();
  @Output() formClose = new EventEmitter<void>();
  form: UntypedFormGroup;
  displayMessage: { [key: string]: string } = {};
  private genericValidator: GenericValidator;
  private readonly validationMessages: { [key: string]: { [key: string]: string } };
  constructor(private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.form = this.fb.group({
        authorization_no: [''],
        prepared_by: [''],
        approved_by: ['',],
        authorized_by: ['',],
      });
      this.genericValidator = new GenericValidator(this.validationMessages);
     }

  ngOnInit(): void {
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

