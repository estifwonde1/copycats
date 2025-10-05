import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Location } from '../../../../setup/models/location.model';
import { GenericValidator } from '../../../../shared/validators/generic.validator';
import { Role } from '../../../models/role.model';

@Component({
  selector: 'cats-roles-form',
  templateUrl: './roles-form.component.html',
  styleUrls: ['./roles-form.component.scss']
})
export class RolesFormComponent implements OnInit {
  @Output() formSubmit = new EventEmitter<Role>();
  @Output() formClose = new EventEmitter<void>();
  @Output() roleSelect = new EventEmitter<number>();
  form: UntypedFormGroup;
  roles$: Observable<Role[]>;
  warehouses$: Observable<Location[]>;
  hubs$: Observable<Location[]>;
  
  displayMessage: { [key: string]: string } = {};
  private genericValidator: GenericValidator;
  private readonly validationMessages: { [key: string]: { [key: string]: string } };
  constructor(private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.roles$ = this.data.lookupData.roles$;
      this.warehouses$ = this.data.lookupData.warehouses$;
      this.hubs$ = this.data.lookupData.hubs$;

      this.form = this.fb.group({
        role_id: [data.formData.role_id, Validators.required],
        user_id: data.formData.user_id,
        warehouse_id: data.formData.warehouse_id,
        hub_id: data.formData.hub_id
      });

      this.validationMessages = {
        role_id: {
          required: 'Role is required.'
        }
      };

      this.genericValidator = new GenericValidator(this.validationMessages);
     }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(
      () => this.displayMessage = this.genericValidator.processMessages(this.form)
    );
  }

  onRoleChange({value}: any): void {
    this.roleSelect.emit(value);
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
