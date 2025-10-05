import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { from, Observable } from 'rxjs';
import { LocationQuery } from '../../../../setup/state/location/location.query';
import { GenericValidator } from '../../../../shared/validators/generic.validator';
import { ProspectiveDispatchPlanItemQuery } from '../../../state/dispatch-plan-item/dispatch-plan-item.query';

@Component({
  selector: 'cats-generated-dispatch-plan-items',
  templateUrl: './generated-dispatch-plan-items.component.html',
  styleUrls: ['./generated-dispatch-plan-items.component.scss']
})
export class GeneratedDispatchPlanItemsComponent implements OnInit {
  @Output() roundPlanChange = new EventEmitter<any>();
  @Output() formClose = new EventEmitter<void>();
  @Output() formSubmit = new EventEmitter<any>();
  @Output() apply = new EventEmitter<any>();
  @Output() zoneChange = new EventEmitter<any>();
  @Output() zoneSelected = new EventEmitter<string>();
  items$: Observable<any[]>;
  commodities$: Observable<any[]>;
  sources$: Observable<any[]>;
  zones$: Observable<any[]>;
  commodityCategories: any[] = [];
  zoneId: any;
  zoneName: any;
  commodityCategoryId: any;

  monthlyPlans$: Observable<any[]>;
  selectedItems: any;
  form: UntypedFormGroup;
  displayMessage: { [key: string]: string } = {};
  private genericValidator: GenericValidator;
  private readonly validationMessages: { [key: string]: { [key: string]: string } };
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private fb: UntypedFormBuilder,
              private locationQuery: LocationQuery,
              private query: ProspectiveDispatchPlanItemQuery) {
    this.items$ = this.data.items$;
    this.monthlyPlans$ = this.data.monthlyPlans$;
    this.sources$ = this.data.sources$;
    this.commodities$ = this.data.commodities$;
    this.form = this.fb.group({
      reference_no: ['', Validators.required],
      dispatch_plan_item_reference_no: [''],
      source: null,
      commodity: null,
      dispatchable_id: ['', Validators.required],
      dispatchable_type: 'Cats::Core::RoundPlan',
      zone_id: null
    });
    this.validationMessages = {
      reference_no: {
        required: 'Reference number is required.',
      },
      dispatchable_id: {
        required: 'Round plan is required.'
      }
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
   }

  ngOnInit(): void {
    this.form.get('zone_id').valueChanges.subscribe((value: any) => {
      this.onZoneChange(value);
      if(typeof value === 'string') {
        this.zones$ = this.locationQuery.getByName(value);
      } else {
        this.zoneId = value.id;
      }
    });

    this.form.valueChanges.subscribe(
      () => this.displayMessage = this.genericValidator.processMessages(this.form)
    );
    this.filterCommodityCategories();
  }

  filterCommodityCategories() {
    this.commodityCategories = [];
    this.items$.subscribe((result:any) => {
      for(let r of result){ 
         if(!this.commodityCategories.includes(r.commodity_category)){
              this.commodityCategories.push(r.commodity_category);
          }
      }
    });
  }

  onZoneChange(zone: any): void {
    if(zone.length === 3) {
      this.zoneChange.emit(zone);
    }
  }

  onCommodityCategoryCahnge(event: any) {
    if(this.zoneName) {
      this.items$ = this.query.selectByZoneAndCommodityCategory(this.zoneName, event.value);
    } else {
      this.items$ = this.query.selectByCommodityCategory(event.value);
    }
    this.commodityCategoryId = event.value;
  }

  onRoundPlanChange(): void {
    this.roundPlanChange.emit(this.form.value.dispatchable_id);
  }

  onZoneSelect(zone: any) {
    if(this.commodityCategoryId) {
      this.items$ = this.query.selectByZoneAndCommodityCategory(zone.name, this.commodityCategoryId);
    } else {
      this.items$ = this.query.selectByZone(zone.name);
    }
    this.zoneName = zone.name;
  }

  onClearZoneFilter() {
    this.items$ = this.query.selectAll();
  }

  onSubmit(): void {
    const {reference_no, dispatchable_id, dispatchable_type} = this.form.value;
    this.formSubmit.emit({reference_no, dispatchable_id, dispatchable_type});
  }

  blur(): void {
    this.displayMessage = this.genericValidator.processMessages(this.form);
  }

  onApply(): void {
    const {source, commodity, dispatch_plan_item_reference_no} = this.form.value;
    const itemIds = this.selectedItems.map((item: any) => item.id);
    this.apply.emit({
      source_id: source.id, 
      source_name: source.name, 
      commodity_id: commodity.id, 
      commodity_batch_no: commodity.batch_no, 
      reference_no: dispatch_plan_item_reference_no,
      itemIds
    });
  }

  zoneLocationDisplayFn(location: any) {
    let name = '';
    if(location) { 
      name = location.name;
    }
    return name;
  }

  onCancel(): void {
    this.formClose.emit();
  }

}
