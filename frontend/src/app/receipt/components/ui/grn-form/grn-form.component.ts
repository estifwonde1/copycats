import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GenericValidator } from '../../../../shared/validators/generic.validator';

@Component({
  selector: 'cats-grn-form',
  templateUrl: './grn-form.component.html',
  styleUrls: ['./grn-form.component.scss']
})
export class GrnFormComponent implements OnInit {
  @Output() formSubmit = new EventEmitter<Location>();
  @Output() formClose = new EventEmitter<void>();
  form: UntypedFormGroup;
  displayMessage: { [key: string]: string } = {};
  private genericValidator: GenericValidator;
  private readonly validationMessages: { [key: string]: { [key: string]: string } };
  constructor(private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {

      this.form = this.fb.group({
        receipt_no: ['', Validators.required],
        purchase_requisition_no: '',
        requested_by: ['', [Validators.required]],
        invoice_no: '',
        wt_bridge_ticket_no: '',
        container_type: ['', [Validators.required]],
        no_of_containers: ['', [Validators.required]],
        gross: ['', [Validators.required]],
        net: ''
      });

      this.validationMessages = {
        receipt_no: {
          required: 'Receipt number is required.',
        },
        purchase_requisition_no: {
          required: 'Purchase requisition number is required.'
        },
        requested_by: {
          required: 'Requested by is required.'
        },
        invoice_no: {
          required: 'Invoice number is required.'
        }
      }
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
