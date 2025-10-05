import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { FloorPlanFormComponent } from '../../ui/floor-plan-form/floor-plan-form.component';

import { FloorPlanComponent } from './floor-plan.component';

describe('FloorPlanComponent', () => {
  let component: FloorPlanComponent;
  let fixture: ComponentFixture<FloorPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloorPlanComponent, FloorPlanFormComponent ],
      imports: [
        MatDialogModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        DropdownModule,
        MatButtonModule,
        FormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {formData: {}} },
        MessageService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FloorPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call methods inside onStoreChange', () => {
    component.store = {
      name: 'store 1', store_keeper_name: 'Abebe', store_keeper_phone: '092344334', length: 232,
      width: 234, height: 243, has_gangway: false, warehouse_id: 1, id: 1, stacks: []
    };
    component.ctxBottom = component.canvasBottom.nativeElement.getContext('2d') as unknown as CanvasRenderingContext2D;
    const setCanvasDimensionSpy = spyOn(component, 'setCanvasDimension');
    const setContextSpy = spyOn(component, 'setContext');
    const canvasEventsSpy = spyOn(component, 'mouseMoveEvent');
    component.onStoreChange();
    expect(setCanvasDimensionSpy).toHaveBeenCalled();
    expect(setContextSpy).toHaveBeenCalled();
    expect(canvasEventsSpy).toHaveBeenCalled();
  });

  it('should set the canvas to 1330', () => {
    component.store = {
      name: 'store 1', store_keeper_name: 'Abebe', store_keeper_phone: '092344334', length: 232,
      width: 234, height: 243, has_gangway: false, warehouse_id: 1, id: 1, stacks: []
    };
    component.onStoreChange();
    const store = component.store;
    const canvas = component.canvas.nativeElement;
    expect(canvas.width).toEqual(1330);
    expect(canvas.height).toEqual(1330);
  });

  describe('drawExistingPlaces', () => {
    it('should fill valid places with existing places from a store', () => {
      component.store = component.store = {
        name: 'store 1', store_keeper_name: 'Abebe', store_keeper_phone: '092344334', length: 732,
        width: 1340, height: 243, has_gangway: false, warehouse_id: 1, id: 1, stacks: []
      };
      component.stackingRule = {space_between_stack: 20, distance_from_wall: 10};
      component.onStoreChange();
       const places = [
        { name: 'stack 2', length: 200, width: 100, start_x:220, start_y:20 },
        { name: 'stack 4', length: 200, width: 100, start_x: 220, start_y: 290},
        { name: 'gang-way', length: 150, width: 460, start_x: 440, start_y: 20},
      ];
      component.drawExistingPlaces(places);
      expect(component.places.length).toEqual(places.length);
    });

    it('should call drawAll method for all of the places', () => {
      component.store = {
        name: 'store 1', store_keeper_name: 'Abebe', store_keeper_phone: '092344334', length: 232,
        width: 234, height: 243, has_gangway: false, warehouse_id: 1, id: 1, stacks: []
      };
      const spy = spyOn(component, 'drawAll');
      component.drawExistingPlaces(component.store.stacks);
      expect(spy).toHaveBeenCalledTimes(component.store.stacks.length);
    });
  });

  it('should allow the user to draw new places', () => {
    const spy = spyOn(component.canvas.nativeElement, 'addEventListener');
    component.canvasEvents();
    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveBeenCalledWith('mousedown', component.mousedownListener);
    expect(spy).toHaveBeenCalledWith('mouseup', component.mouseupListener);
    expect(spy).toHaveBeenCalledWith('mousemove', component.mousemoveListener);
  });

  describe('mousedownListener', () => {
    let event: any;
    beforeEach(() => {
      event = { clientX: 10, clientY: 20 }
    });

    it('should set mouseIsDown to true', () => {
      component.mouseIsDown = false;
      component.mousedownListener(event);
      expect(component.mouseIsDown).toBeTrue();
    });

    it('should change the mouse cursor style to crosshair', () => {
      component.mousedownListener(event);
      expect(component.canvas.nativeElement.style.cursor).toEqual('crosshair');
    });

    it('should set the starting coordinates of the mouse', () => {
      component.scaleAmount = 100;
      const rect = component.canvas.nativeElement.getBoundingClientRect();
      component.mousedownListener(event);
      expect(component.startX).toEqual(Math.round(event.clientX - rect.left)/component.scaleAmount);
      expect(component.startY).toEqual(Math.round(event.clientY - rect.top)/component.scaleAmount);
    });

  });

  describe('mousemoveListener', () => {
    beforeEach(() => {
      component.mouseIsDown = true;
    });

    it('should update currentCanvasPosition coordinates', () => {
      component.store = {...component.store, length: 1330, width: 1330, stacks: []};
      component.onStoreChange();
      const event = { clientX: 10, clientY: 20 };
      const rect = component.canvas.nativeElement.getBoundingClientRect();
      component.mousemoveListener(event);
      expect(component.currentMousePosisitionX).toEqual(Math.round(event.clientX - rect.left));
      expect(component.currentMousePosisitionY).toEqual(Math.round(event.clientY - rect.top));
    });

    it('should call drawAll method', () => {
      component.store = {...component.store, stacks: []};
      component.onStoreChange();
      const spy = spyOn(component, 'drawAll');
      component.mousemoveListener({});
      expect(spy).toHaveBeenCalled();
    });

    it('should call strokeRect method', () => {
      component.store = {...component.store, stacks: []};
      component.scaleAmount = 100;
      component.onStoreChange();
      const spy = spyOn(component.ctx, 'strokeRect');
      component.mousemoveListener({});
      expect(spy).toHaveBeenCalledWith(
        component.startX * component.scaleAmount,
        component.startY * component.scaleAmount,
        (component.currentMousePosisitionX - component.startX) * component.scaleAmount,
        (component.currentMousePosisitionY - component.startY) * component.scaleAmount);
    });
  });

  describe('mouseupListener', () => {
    it('should set mouseIsDown to false', () => {
      component.store = {...component.store, stacks: []};
      component.onStoreChange();
      component.mouseIsDown = true;
      component.mouseupListener();
      expect(component.mouseIsDown).toBeFalse();
    });

    it('should add the new place to places list', () => {
      component.store = {...component.store, width: 1330, length: 600, stacks: []};
      component.onStoreChange();
      component.stackingRule = {space_between_stack: 20, distance_from_wall: 10};
      component.places = [];
      component.newPlace = { left: 20, top: 30, right: 50, bottom: 30 };
      component.mouseupListener();
      expect(component.places.length).toEqual(1);
    });

    it('should change the cursor style to default', () => {
      component.store = {...component.store, stacks: []};
      component.onStoreChange();
      component.canvas.nativeElement.style.cursor = 'crosshair';
      component.mouseupListener();
      expect(component.canvas.nativeElement.style.cursor).toEqual('default');
    });

    it('should call drawAll method', () => {
      const spy = spyOn(component, 'drawAll');
      component.mouseupListener();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('drawAll', () => {
    it('should call clear the canvas before draw the new ones', () => {
      component.store = {...component.store, stacks: []};
      component.onStoreChange();
      const spy = spyOn(component.ctx, 'clearRect');
      component.drawAll();
      expect(spy).toHaveBeenCalledWith(0, 0, component.canvas.nativeElement.width, component.canvas.nativeElement.height);
    });

    it('should draw all of the places inside the places list', () => {
      component.store = {
        name: 'store 1', store_keeper_name: 'Abebe', store_keeper_phone: '092344334', length: 232,
        width: 234, height: 243, has_gangway: false, warehouse_id: 1, id: 1, stacks: []
      };
      component.onStoreChange();
      const spy = spyOn(component.ctx, 'fillRect');
      component.places = [
        { left: 20, top: 5, right: 3, bottom: 15},
        { left: 20, top: 10, right: 3, bottom: 20}
      ];
      component.scaleAmount = 100;
      const place = component.places[0];
      component.drawAll();
      expect(spy).toHaveBeenCalledTimes(2);
      expect(spy).toHaveBeenCalledWith(
        place.left * component.scaleAmount,
        place.top * component.scaleAmount,
        (place.right - place.left)* component.scaleAmount,
        (place.bottom - place.top)* component.scaleAmount );
    });
  });
});
