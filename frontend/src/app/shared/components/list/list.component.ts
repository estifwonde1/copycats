import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Column } from '../../models/column.model';

@Component({
  selector: 'cats-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  @Input() data: any;
  @Input() columns: Column[] = [];
  @Input() caption: string;
  @Input() actions: any;
  @Input() checkbox: boolean;
  @Input() hasAction: boolean;
  @Input() loading: boolean;
  @Input() checkedData: any[];
  @Input() columnFilterOptions: any[] = [];


  @Output() actionClick = new EventEmitter<any>();
  @Output() selectedData = new EventEmitter<any[]>();
  constructor() { }

  ngOnInit(): void {
  }

  onClick(item: any, type: string) {
    this.actionClick.emit({item, type});
  }

  onSelect() {
    this.selectedData.emit(this.checkedData);
  }

}
