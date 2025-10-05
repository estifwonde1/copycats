import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ReceiptAuthorizationFormComponent } from './receipt-authorization-form.component';

describe('ReceiptAuthorizationFormComponent', () => {
  let component: ReceiptAuthorizationFormComponent;
  let fixture: ComponentFixture<ReceiptAuthorizationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiptAuthorizationFormComponent ],
      imports: [
        ReactiveFormsModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceiptAuthorizationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
