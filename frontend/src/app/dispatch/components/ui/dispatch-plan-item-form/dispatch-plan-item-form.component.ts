import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { COMMODITY_STATUS } from '../../../../shared/constants/commodity-status.constant';
import { GenericValidator } from '../../../../shared/validators/generic.validator';
import { DispatchPlanItem } from '../../../models/dispatch-plan-item.model';
import { PositiveNumberValidatorService } from '../../../../shared/services/positive-number-validator.service';

@Component({
  selector: 'cats-dispatch-plan-item-form',
  templateUrl: './dispatch-plan-item-form.component.html',
  styleUrls: ['./dispatch-plan-item-form.component.scss']
})
export class DispatchPlanItemFormComponent implements OnInit {
  @Output() formSubmit = new EventEmitter<DispatchPlanItem>();
  @Output() formClose = new EventEmitter<void>();
  @Output() sourceLocationTypeSelected = new EventEmitter<string>();
  @Output() destinationLocationTypeSelected = new EventEmitter<string>();
  maximumQuantity: number;

  commodities$: Observable<any[]>;
  commodityStatuses: string[] = COMMODITY_STATUS;
  locationTypes: string[];
  sourceLocations$: Observable<any[]>;
  destinationLocations$: Observable<any[]>;
  sourceLocations: any[];
  destinationLocations: any[];
  filteredSourceLocations$: Observable<any[]>;
  filteredDestinationLocations$: Observable<any[]>;
  unitOfMeasures: Observable<any[]>;
  form: UntypedFormGroup;
  displayMessage: { [key: string]: string } = {};
  private genericValidator: GenericValidator;
  private readonly validationMessages: { [key: string]: { [key: string]: string } };
  
  constructor(private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private positiveNumberService:PositiveNumberValidatorService) {
      this.locationTypes = this.data.lookupData.locationTypes;
      this.sourceLocations$ = this.data.lookupData.sourceLocations$;
      this.destinationLocations$ = this.data.lookupData.destinationLocations$;
      this.maximumQuantity = this.data.lookupData.maximumQuantity;
      this.commodities$ = this.data.lookupData.commodities$;
      this.unitOfMeasures = this.data.lookupData.unitOfMeasures$;

      this.form = this.fb.group({
        id: data.formData.id,
        reference_no: [data.formData.reference_no, Validators.required],
        quantity: [data.formData.quantity, [Validators.required, positiveNumberService.positiveNumberValidator(),
           Validators.max(this.maximumQuantity)]],
        unit_id: [data.formData.unit_id, Validators.required],
        destination: [data.formData.destination, Validators.required],
        source: [data.formData.source, Validators.required],
        dispatch_plan_id: data.formData.dispatch_plan_id,
        destination_location_type: data.formData.destination_location_type,
        source_location_type: data.formData.source_location_type,
        commodity_status: data.formData.commodity_status,
        commodity_id: data.formData.commodity_id,
      });

      this.validationMessages = {
        from: {
          required: 'From date is required.'
        },
        to: {
          required: 'To date is required.'
        },
        quantity: {
          required: 'Quantity is required.',
          max: `${this.maximumQuantity} is the maximum value.`,
          invalidNumber: 'Quantity should be greater than zero.'
        },
        unit_id: {
          required: 'Unit of measurement is required.'
        },
        destination: {
          required: 'Destination is required.'
        },
        commodity_id: {
          required: 'Commodity is required.'
        }
      };
      this.genericValidator = new GenericValidator(this.validationMessages);
     }

  ngOnInit(): void {
    this.sourceLocations$?.subscribe(res => {
      this.sourceLocations = res;
      this.setSourceField(res);
    });
    this.destinationLocations$?.subscribe(res => {
      this.destinationLocations = res;
      this.setDestinationField(res);
    });
    this.setSourceFilteredLocations();
    this.setDestinationFilteredLocations();
    this.form.valueChanges.subscribe(
      () => this.displayMessage = this.genericValidator.processMessages(this.form)
    );
  }

  setDestinationField(locations: any): void {
    this.form.patchValue({
      destination: locations?.filter((location: any) => location.id === this.data.formData.destination_id)[0]
    });
  }

  setSourceField(locations: any): void {
    this.form.patchValue({
      source: locations?.filter((location: any) => location.id === this.data.formData.source_id)[0]
    });
  }

  setDestinationFilteredLocations(): void {
    this.filteredDestinationLocations$ = this.form.controls.destination.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value?.id),
        map(name => name ? this._filter(name, this.destinationLocations) : [])
      );
  }

  setSourceFilteredLocations(): void {
    this.filteredSourceLocations$ = this.form.controls.source.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value?.id),
        map(name => name ? this._filter(name, this.sourceLocations) : [])
      );
  }

  displayFn(location: any): string {
    return location && location.name ? location.name : '';
  }

  blur(): void {
    this.displayMessage = this.genericValidator.processMessages(this.form);
  }

  onSourceLocationTypeSelect(): void {
    const {source_location_type} = this.form.value;
    this.sourceLocationTypeSelected.emit(source_location_type);
  }

  onDestinationLocationTypeSelect(): void {
    const {destination_location_type} = this.form.value;
    this.destinationLocationTypeSelected.emit(destination_location_type);
  }

  onSubmit(): void {
    const payload = { 
      ...this.form.value, 
      destination_id: this.form.value.destination.id,
      source_id: this.form.value.source.id 
    };
    this.formSubmit.emit(payload);
  }

  onCancel(): void {
    this.formClose.emit();
  }

  private _filter(name: any, locations: any[]): string[] {
    const filterValue = typeof name === 'string' ? name.toLowerCase() : name;
    return locations.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }
  
}
