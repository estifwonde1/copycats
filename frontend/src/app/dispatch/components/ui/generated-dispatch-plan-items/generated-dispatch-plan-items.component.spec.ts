import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { from } from 'rxjs';

import { GeneratedDispatchPlanItemsComponent } from './generated-dispatch-plan-items.component';

describe('GeneratedDispatchPlanItemsComponent', () => {
  let component: GeneratedDispatchPlanItemsComponent;
  let fixture: ComponentFixture<GeneratedDispatchPlanItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneratedDispatchPlanItemsComponent ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ],
      imports: [
        ReactiveFormsModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatAutocompleteModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratedDispatchPlanItemsComponent);
    component = fixture.componentInstance;
    component.items$ = from([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
