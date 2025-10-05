import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'cats-location-filter',
  templateUrl: './location-filter.component.html',
  styleUrls: ['./location-filter.component.scss']
})
export class LocationFilterComponent implements OnInit {
  @Input() locationTypes: string[] = [];
  @Input() regions: any;
  @Input() zones: any[] = [];
  @Input() woredas: any[] = [];
  @Input() fdps: any[] = [];
  @Input() kebeles: any[] = [];
  @Input() hubs: any[] = [];
  @Input() warehouses: any[] = [];

  @Input() allLocationAncestries: any[] = [];
  @Input() selectedLocationAncestries: any[] = [];
  
  @Output() locationTypeChage = new EventEmitter<string>();
  
  selectedLocationType: string;


  constructor() { }

  ngOnInit(): void {

  }

  onLocationTypeChange(): void {
    this.locationTypeChage.emit(this.selectedLocationType);
  }
}
