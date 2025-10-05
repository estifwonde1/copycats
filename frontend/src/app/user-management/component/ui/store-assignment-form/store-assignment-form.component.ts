import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Store } from '../../../../setup/models/store.model';
import { GenericValidator } from '../../../../shared/validators/generic.validator';

@Component({
  selector: 'cats-store-assignment-form',
  templateUrl: './store-assignment-form.component.html',
  styleUrls: ['./store-assignment-form.component.scss']
})
export class StoreAssignmentFormComponent implements OnInit {
  @Output() formSubmit = new EventEmitter<any>();
  @Output() formClose = new EventEmitter<void>();
  @Output() fetchStores = new EventEmitter<any>();
  @Output() regionChange = new EventEmitter<any>();
  @Output() hubChange = new EventEmitter<any>();
  @Output() zoneChange = new EventEmitter<any>();
  @Output() woredaChange = new EventEmitter<any>();
  @Output() fdpChange = new EventEmitter<any>();
  form: UntypedFormGroup;
  stores$: Observable<Store[]>;
  storekeeperStores$: Observable<Store[]>;
  regions: any[] = [];
  hubs: any[] = [];
  zones: any[] = [];
  woredas: any[] = [];
  fdps: any[] = [];
  warehouses: any = [];
  storeType:string;

  displayMessage: { [key: string]: string } = {};
  private genericValidator: GenericValidator;
  private readonly validationMessages: { [key: string]: { [key: string]: string } };
  constructor(private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.stores$ = this.data.lookupData.stores$;
      this.storekeeperStores$ = this.data.lookupData.storekeeperStores$;
      this.storeType = this.data.lookupData.storeType;
    this.form = this.fb.group({
      warehouse_id: null,
      store_id: null,
    });

    this.validationMessages = {
      store_id: {
        required: 'Store is required.'
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

  onStoreChange(): void {
    this.fetchStores.emit(this.form.value.warehouse_id);
  }

  onSubmit(): void {
    this.formSubmit.emit(this.form.value);
  }

  onCancel(): void {
    this.formClose.emit();
  }

  onRegionChange(event: any) {
    this.regionChange.emit(event.value);
    this.hubs = this.zones = this.woredas = this.fdps = this.warehouses = [];
  }

  onHubChange(event: any) {
    this.hubChange.emit(event.value);
    this.warehouses = [];
  }

  onZoneChange(event: any) {
    this.zoneChange.emit(event.value);
    this.woredas = this.fdps = [];
  }

  onWoredaChange(event: any) {
    this.woredaChange.emit(event.value);
    this.fdps = this.warehouses = [];
  }

  onFdpChange(event: any) {
    this.fdpChange.emit(event.value);
    this.warehouses = [];
  }
}
