import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FloorPlanFormComponent } from './floor-plan-form.component';

describe('FloorPlanFormComponent', () => {
  let component: FloorPlanFormComponent;
  let fixture: ComponentFixture<FloorPlanFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FloorPlanFormComponent ],
      imports: [
        ReactiveFormsModule,
        MatSelectModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {formData: {}, lookupData: {}} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FloorPlanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit discard', () => {
    const spy = spyOn(component.formClose, 'emit');
    component.onDiscard();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit the form values when user clicks on save', () => {
    const spy = spyOn(component.formSubmit, 'emit');
    component.onSave();
    expect(spy).toHaveBeenCalledWith(component.form.value);
  });
});
