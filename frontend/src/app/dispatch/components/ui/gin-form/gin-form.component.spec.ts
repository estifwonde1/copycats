import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { GinFormComponent } from './gin-form.component';

describe('GinFormComponent', () => {
  let component: GinFormComponent;
  let fixture: ComponentFixture<GinFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GinFormComponent ],
      imports: [
        ReactiveFormsModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GinFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
