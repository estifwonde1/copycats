import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RectangularPlace } from '../../../models/rectangular-place.model';
import { MatDialog } from '@angular/material/dialog';
import { FloorPlanFormComponent } from '../../ui/floor-plan-form/floor-plan-form.component';
import { Observable, of } from 'rxjs';
import { StoreService } from '../../../../setup/state/store/store.sevice';
import { StoreQuery } from '../../../../setup/state/store/store.query';
import { SessionQuery } from '../../../../auth/state/session.query';
import { Store } from '../../../../setup/models/store.model';
import { StackingRuleService } from '../../../state/stacking-rule/stacking-rule.sevice';
import { StackingRuleQuery } from '../../../state/stacking-rule/stacking-rule.query';
import { StackingRule } from '../../../models/stacking-rule.model';
import { StackService } from '../../../state/stack/stack.sevice';
import { DialogConfig } from '../../../../shared/models/dialog-config.model';
import { EMPTY_STACK, Stack } from '../../../models/stack.model';
import { DialogService } from '../../../../shared/services/dialog.service';
import { STACK_STATUSES } from '../../../constants/stack-status.constant';
import { OperationService } from '../../../services/operation.service';
import { UtilService } from '../../../../shared/services/util.service';
import { StackQuery } from '../../../state/stack/stack.query';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { StackStore } from '../../../../floor-plan/state/stack/stack.store';


@Component({
  selector: 'cats-floor-plan',
  templateUrl: './floor-plan.component.html',
  styleUrls: ['./floor-plan.component.scss']
})
export class FloorPlanComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('canvas', { static: true}) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasBottom', { static: true}) canvasBottom: ElementRef<HTMLCanvasElement>;

  stackStatuses: string[] = Object.entries(STACK_STATUSES).map(status => status[0]);
  selectedReceiptPlan: any;
  store: Store;
  status: string;
  commodity: any;
  commodities$: Observable<any[]> = this.stackQuery.selectCommodities()
  ctx: CanvasRenderingContext2D;
  ctxBottom: CanvasRenderingContext2D;

  currentMousePosisitionX = 0;
  currentMousePosisitionY = 0;

  mouseIsDown = false;

  places: RectangularPlace[] = [];
  newPlace: RectangularPlace;
  selectedPlace: RectangularPlace;

  actions: any[] = [
    { icon: 'edit', label: 'Edit', disabled: true, color: 'warn' }
  ];

  scaleAmount: number;

  // starting position of the mouse
  startX: number;
  startY: number;

  stackingRule: StackingRule;

  tooltipVisbile = false;
  div: any;

  dialogConfig: DialogConfig = {
    width: '800px',
    formComponent: FloorPlanFormComponent,
    dialog: this.dialog,
    service: this.stackService,
    parentComponent: this
  } as DialogConfig;

  stores$: Observable<any> = this.storeQuery.selectCurrentUserStores();
  stacks$: Observable<any[]> = this.stackQuery.selectAll();
  constructor(private dialog: MatDialog,
              private storeQuery: StoreQuery,
              private storeService: StoreService,
              private sessionQuery: SessionQuery,
              private stackingRuleService: StackingRuleService,
              private stackingRuleQuery: StackingRuleQuery,
              private stackService: StackService,
              private operationService: OperationService,
              private utilService: UtilService,
              private stackQuery: StackQuery,
              private stackStore: StackStore) { }

  ngOnInit(): void {
    this.loadUserStores();
    this.loadStackingRules();
    this.setStackingRules();
    this.loadCommodities();
  }

  loadStacks(storeId: any) {
    this.blockUI.start('Loading...');
    this.stackService.get(storeId).subscribe(({data})=>{
      this.blockUI.stop();
      this.drawGangway(this.store);
      this.drawExistingPlaces(data);
    }, () => this.blockUI.stop());
  }

  loadStackingRules(): void {
    this.blockUI.start('Loading...');
    this.stackingRuleService.get().subscribe(
      () => this.blockUI.stop(), () => this.blockUI.stop()
    );
  }

  loadUserStores(): void {
    const currentUserId = this.sessionQuery.userId;
    this.blockUI.start('Loading...');
    this.storeService.getCurrentUserStores(currentUserId).subscribe(
      () => this.blockUI.stop(), () => this.blockUI.stop()
    );
  }

  loadCommodities(): void {
    this.blockUI.start('Loading...');
    this.stackService.getCommodities().subscribe(
      () => this.blockUI.stop(), () => this.blockUI.stop()
    );
  }

  setCanvasDimension(): void {
    this.canvas.nativeElement.width = 1330;
    this.canvas.nativeElement.height = 1330;

    this.canvasBottom.nativeElement.width = 1345;
    this.canvasBottom.nativeElement.height = 1345;
  }

  setContext(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d') as unknown as CanvasRenderingContext2D;
    this.ctxBottom = this.canvasBottom.nativeElement.getContext('2d') as unknown as CanvasRenderingContext2D;
  }

  drawExistingPlaces(places: any[]): void {
    const { distance_from_wall, space_between_stack, maximum_length, maximum_width } = this.stackingRule;
    for (const place of places) {

      const rectangularPlace: RectangularPlace = {
        left: place.start_x,
        top: place.start_y,
        right: place.start_x + place.length,
        bottom: place.start_y + place.width,
        color: this.setStackColors(this.utilService.titleCase(place.stack_status))
      };

      if (!this.operationService.doOverlapToExistingPlaces(rectangularPlace, this.places) &&
          this.operationService.isFarFromWall(rectangularPlace, distance_from_wall, this.store) &&
          this.operationService.isFarFromOtherPlaces(rectangularPlace, space_between_stack, this.places) &&
          !this.operationService.isOverMaximumLength(this.newPlace, maximum_length) &&
          !this.operationService.isOverMaximumWidth(this.newPlace, maximum_width)) {
            this.places.push(rectangularPlace)
      }
      this.drawAll();
    }
  }

  setStackColors(status: string): string {
    switch (status) {
      case this.utilService.titleCase(STACK_STATUSES.RESERVED):
        return 'rgb(77, 124, 77)'
      case this.utilService.titleCase(STACK_STATUSES.ALLOCATED):
        return '#7b3a3a'
      default:
        return 'rgb(77, 124, 77)';
    }
  }

  drawGangway(store: Store): void {
    const { gangway_corner_dist, gangway_width, has_gangway, gangway_length } = store;
    this.places = [];
    if (has_gangway) {
      const place: RectangularPlace = {
        left: gangway_corner_dist,
        top: 0,
        right: gangway_corner_dist + gangway_length,
        bottom: gangway_width,
        type: 'gangway',
        color: '#293846'
      }
      this.places.push(place);
      this.drawAll();
    }
  }

  mouseMoveEvent(): void {
    this.canvas.nativeElement.addEventListener('mousemove', this.mousemoveListener);
  }

  canvasEvents(): void {
    this.canvas.nativeElement.addEventListener('mousedown', this.mousedownListener);
    this.canvas.nativeElement.addEventListener('mouseup', this.mouseupListener);
    this.mouseMoveEvent();
    this.canvas.nativeElement.addEventListener('click', this.clickListener);
  }

  removeCanvasEvents(): void {
    this.canvas.nativeElement.removeAllListeners();
    this.mouseMoveEvent();
  }

  isInsideRectangle(pointX: number, pointY: number, rectangle: RectangularPlace): boolean {
    const { left, right, top, bottom } = rectangle;
    return left < pointX && pointX < right && top < pointY && pointY < bottom;
  }

  clickListener = (e: any) => {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left)/this.scaleAmount;
    const y = Math.round(e.clientY - rect.top)/this.scaleAmount;
    this.selectedPlace = this.places.filter((place) => this.isInsideRectangle(x, y, place))[0];
    if (this.selectedPlace && this.selectedPlace.type !== 'gangway') {
      this.actions.map(action => action.disabled = false);
      const { left, top, right, bottom } = this.selectedPlace;
      this.ctx.fillStyle = '#2F4050';
      this.ctx.fillRect(left*this.scaleAmount, top*this.scaleAmount, (right - left)*this.scaleAmount, (bottom - top)*this.scaleAmount);
    } else {
      this.actions.map(action => action.disabled = true);
    }
  }

  mousedownListener = (e: any) => {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    this.mouseIsDown = true;
    this.canvas.nativeElement.style.cursor = 'crosshair';
    this.startX = (Math.round(e.clientX - rect.left)/this.scaleAmount);
    this.startY = (Math.round(e.clientY - rect.top)/this.scaleAmount);
  }

  mousemoveListener = (e:any) => {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    this.currentMousePosisitionX = Math.round(e.clientX - rect.left)/this.scaleAmount;
    this.currentMousePosisitionY = Math.round(e.clientY - rect.top)/this.scaleAmount;
    if (this.mouseIsDown) {
      this.newPlace = {
        left: Math.min(this.startX, this.currentMousePosisitionX),
        right: Math.max(this.startX, this.currentMousePosisitionX),
        top: Math.min(this.startY, this.currentMousePosisitionY),
        bottom: Math.max(this.startY, this.currentMousePosisitionY)
      }

      const width = this.currentMousePosisitionX - this.startX;
      const height = this.currentMousePosisitionY - this.startY;

      this.drawAll();
      this.ctx.strokeStyle = 'lightgray';
      this.ctx.lineWidth = 3;
      this.ctx.strokeRect(this.startX*this.scaleAmount, this.startY*this.scaleAmount, width*this.scaleAmount, height*this.scaleAmount);
    }else {
      const selectedPlace = this.places.filter((place) => this.isInsideRectangle(
        this.currentMousePosisitionX, this.currentMousePosisitionY, place))[0];

        this.toggleTooltip(selectedPlace, e);
    }
  }

  toggleTooltip(selectedPlace: RectangularPlace, e: any): void {
    const tooltipContent = this.extractStackInformation(selectedPlace);
    const parent = this.canvas.nativeElement.parentNode;
    this.div = document.createElement('div');
    if (selectedPlace) {
      this.div.className = 'tooltip';
      this.div.innerHTML = this.operationService.getTooltipContent(tooltipContent);
      if (!this.tooltipVisbile) {
        this.showTooltip(parent, e);
      }
    } else {
      if (parent.childNodes.length === 3) {
        this.hideTooltip(parent);
      }
    }
  }

  extractStackInformation(selectedPlace: RectangularPlace): any {
    let info: any;
    if (selectedPlace?.type === 'gangway') {
      info =  {
        code: 'Gangway', width: this.store.gangway_width,
        length: this.store.gangway_length,
        start_x: this.store.gangway_corner_dist, start_y: 0 }
    }else {
      const stack: Stack[] = this.store?.stacks.filter(
        stack => stack.start_x === selectedPlace?.left && stack.start_y === selectedPlace?.top
                 && stack.stack_status !== 'Destroyed');
      info = stack.map((s) => {
        return {...s, length: s.length.toFixed(3),
          width: s.width.toFixed(3), start_x: s.start_x.toFixed(3), start_y: s.start_y.toFixed(3)
        }
      })[0];
    }
    return info;
  }

  showTooltip(parent: any, e: any): void {
    this.tooltipVisbile = true;
    this.div.style.left = `${e.clientX}px`;
    this.div.style.top =  `${e.clientY}px`;
    parent.appendChild(this.div);
  }

  hideTooltip(parent: any): void {
    parent.removeChild(parent.lastChild);
    this.tooltipVisbile = false;
  }

  mouseupListener = () => {
    this.mouseIsDown = false;
    this.canvas.nativeElement.style.cursor = 'default';
    const {distance_from_wall, space_between_stack, maximum_length, maximum_width} = this.stackingRule;
    if (!this.operationService.doOverlapToExistingPlaces(this.newPlace, this.places) &&
        this.operationService.isFarFromWall(this.newPlace, distance_from_wall, this.store) &&
        this.operationService.isFarFromOtherPlaces(this.newPlace, space_between_stack, this.places) &&
        !this.operationService.isOverMaximumLength(this.newPlace, maximum_length) &&
        !this.operationService.isOverMaximumWidth(this.newPlace, maximum_width)) {
      this.places.push(this.newPlace);
      this.createPlace();
    } else {
      this.newPlace = null;
    }
    this.drawAll();
  }

  createPlace(): void {
    const {maximum_length, maximum_width, maximum_height} = this.stackingRule;
    this.dialogConfig.title = 'Add New Stack';
    this.dialogConfig.lookupData = {
      maximumLength: maximum_length,
      maximumWidth: maximum_width,
      maximumHeight: maximum_height
    };
    this.dialogConfig.formData = {
      ...EMPTY_STACK,
      store_id: this.store?.id,
      commodity_id: this.commodity?.commodity_id,
      unit_id: this.commodity?.package_unit_id,
      start_x: this.newPlace?.left,
      start_y: this.newPlace?.top,
      length: this.newPlace?.right - this.newPlace?.left,
      width: this.newPlace?.bottom - this.newPlace?.top,
    };
   const dialogRef = DialogService.handleDialog(this.dialogConfig);
   this.afterDialogClosed(dialogRef);
  }

  afterDialogClosed(dialogRef: any): void {
    const discardSub = this.discardPlace(dialogRef);
    const saveSub = (dialogRef.componentInstance as any).formSubmit.subscribe(() => {
      this.newPlace = null;
    });
    dialogRef.afterClosed().subscribe(() => {
      discardSub.unsubscribe();
      saveSub.unsubscribe();
    });
  }

  discardPlace = (dialogRef: any) => {
    return (dialogRef.componentInstance as any).formClose.subscribe(() => {
      this.places = this.places.filter(place => place !== this.newPlace);
      this.drawAll();
      this.newPlace = null;
    });
  }

  drawAll = () => {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement?.width, this.canvas.nativeElement?.height);
    this.ctx.lineWidth = 1;
    this.setStoreDemarcation(this.store);
    for (const place of this.places) {
      if (place.type === 'gangway') {
        this.ctx.fillStyle = '#6b7279';
        this.ctx.fillRect(
          place?.left*this.scaleAmount,
          place?.top*this.scaleAmount,
          (place?.right - place?.left)*this.scaleAmount,
          (place?.bottom - place?.top)*this.scaleAmount);
        } else {
        this.ctx.fillStyle = place.color ? place.color : 'green';
        this.ctx.fillRect(place?.left*this.scaleAmount,
          place?.top*this.scaleAmount,
          (place?.right - place?.left)*this.scaleAmount,
          (place?.bottom - place?.top)*this.scaleAmount);
      }
    }
  }

  beforeEditCheck() {
    const { left, top } = this.selectedPlace;
    const stacks = this.stackQuery.getAll();
    const stack = stacks.filter((stack: any) => stack.start_x === left && stack.start_y === top)[0];
    if(stack.stack_status === 'Allocated' && stack.quantity > 0 &&
       stack.commodity_id !== this.commodity.commodity_id) {
        this.utilService.showMessage('warn', 'Warning', 'Stack is not empty. Please first empty the stack');
    } else if(stack.stack_status === 'Allocated' && stack.commodity_id === this.commodity.commodity_id) {
      this.editStack(stack);
    } else if(stack.stack_status === 'Allocated' && stack.quantity === 0 &&
              stack.commodity_id !== this.commodity.commodity_id) {
      this.destroyAndCreateNewStack(stack);
    } else if(stack.stack_status === 'Reserved') {
      this.editStack(stack);
    }
  }

  getCurrentDateAndTime() {
    let date = new Date();
    return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;
  }

  destroyAndCreateNewStack(oldStack: Stack) {
    let newStack: Stack = { ...oldStack, id: null, stack_status: 'Reserved', quantity: 0 };
    oldStack = { ...oldStack, stack_status: 'Destroyed', code: `${oldStack.code}-${this.getCurrentDateAndTime()}`};
    this.stackService.update(+oldStack.id, oldStack).subscribe((result: any) => {
      if(result.success) {
        this.stackStore.remove(oldStack.id);
        this.stackService.add(newStack).subscribe((response: any) => {
          if(response.success) {
            this.stackStore.add(response.data);
            this.editStack(response.data);
            this.drawGangway(this.store);
            let places = this.stackQuery.getAll();
            this.drawExistingPlaces(places);
          }
        })
      }
    })
  }

  editStack(stack: Stack): void {
    const {maximum_length, maximum_width, maximum_height} = this.stackingRule;
    this.dialogConfig.title = 'Edit Stack';
    this.dialogConfig.lookupData = {
      maximumLength: maximum_length,
      maximumWidth: maximum_width,
      maximumHeight: maximum_height
    };
    this.dialogConfig.formData = {...stack, commodity_id: this.commodity?.commodity_id,
                                   unit_id: this.commodity?.package_unit_id };
    const dialogRef = DialogService.handleDialog(this.dialogConfig);
    this.afterStackEdit(dialogRef);
  }

  afterStackEdit(dialogRef: any): void {
    const { distance_from_wall, space_between_stack, maximum_length, maximum_width } = this.stackingRule;
    const { left, top } = this.selectedPlace;
    const { doOverlapToExistingPlaces, isFarFromOtherPlaces, isFarFromWall, 
      isOverMaximumLength,  isOverMaximumWidth} = this.operationService;
    (dialogRef.componentInstance as any).formSubmit.subscribe((data: any) => {
      const newPlace = {left: data.start_x, top: data.start_y, right: data.start_x + data.length, bottom: data.start_y + data.width};
      if (!doOverlapToExistingPlaces(newPlace, this.places) &&
          isFarFromWall(newPlace, distance_from_wall, this.store) &&
          isFarFromOtherPlaces(newPlace, space_between_stack, this.places) &&
          !isOverMaximumLength(this.newPlace, maximum_length) &&
          !isOverMaximumWidth(this.newPlace, maximum_width)) {
            const place = this.places.filter((place: any) => place.left === left && place.top === top)[0];
            const index = this.places.findIndex(pl => pl === place);
            this.places.splice(index,1, newPlace);
            this.drawAll();
            this.actions.map(action => action.disabled = true);
      }
    });
  }

  setStackingRules(): void {
   this.stackingRuleQuery.selectFirst().subscribe(r => this.stackingRule = {...r});
  }

  onStoreChange(): void {
    this.resetActionButtonStatus();
    this.setCanvasDimension();
    this.setContext();
    this.scaleAmount = this.canvas.nativeElement.width/Math.max(this.store.width, this.store.length);
    this.loadStacks(this.store.id);
    this.mouseMoveEvent();
    this.setRuler();
  }

  onCommodityChange(): void {
    if (this.commodity) {
      this.canvasEvents();
    } else {
      this.removeCanvasEvents();     
    }
  }

  setStoreDemarcation({width, length}: Store): void {
    if (width < length) {
      this.ctx.strokeStyle = 'red';
      this.ctx.moveTo(width*this.scaleAmount, 0);
      this.ctx.lineTo(width*this.scaleAmount, length*this.scaleAmount);
      this.ctx.stroke();
    } else if (length < width) {
      this.ctx.strokeStyle = 'red';
      this.ctx.moveTo(0, length*this.scaleAmount);
      this.ctx.lineTo(width*this.scaleAmount, length*this.scaleAmount);
      this.ctx.stroke();
    }
  }

  setRuler(): void {
    this.ctxBottom.beginPath();
    for (let i = 0; i < this.canvas.nativeElement.width; i+=this.scaleAmount) {
      this.drawLongLine(i);
      this.drawShorLine(i);
    }
    this.ctxBottom.stroke();
  }

  drawLongLine(i: number): void {
    if (this.scaleAmount >= 50) {
      this.ctxBottom.fillText(`${i/this.scaleAmount}`, i+15, 10);
      this.ctxBottom.fillText(`${i/this.scaleAmount}`, 0, i+15);
    }
    this.ctxBottom.moveTo(i+15,0);
    this.ctxBottom.lineTo(i+15,15);
    this.ctxBottom.moveTo(0,i+15);
    this.ctxBottom.lineTo(15,i+15);
  }

  drawShorLine(i: number): void {
    if (this.scaleAmount >= 50) {
      for (let j = i; j < i+this.scaleAmount; j+=10) {
        this.ctxBottom.moveTo(j+15,10);
        this.ctxBottom.lineTo(j+15,15);
        this.ctxBottom.moveTo(10,j+15);
        this.ctxBottom.lineTo(15,j+15);
      }
    }
  }

  resetActionButtonStatus(): void {
    this.selectedPlace = null;
    this.actions.map(action => action.disabled = true);
  }
}
