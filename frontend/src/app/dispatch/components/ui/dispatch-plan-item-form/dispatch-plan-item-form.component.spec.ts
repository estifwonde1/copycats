import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DispatchPlanItemFormComponent } from './dispatch-plan-item-form.component';

describe('DispatchPlanItemFormComponent', () => {
  let component: DispatchPlanItemFormComponent;
  let fixture: ComponentFixture<DispatchPlanItemFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchPlanItemFormComponent ],
      imports: [
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatSelectModule,
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
    fixture = TestBed.createComponent(DispatchPlanItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
