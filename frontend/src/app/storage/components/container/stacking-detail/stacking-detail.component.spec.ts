import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfirmationService, MessageService } from 'primeng/api';

import { StackingDetailComponent } from './stacking-detail.component';

describe('StackingDetailComponent', () => {
  let component: StackingDetailComponent;
  let fixture: ComponentFixture<StackingDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StackingDetailComponent ],
      imports: [
        MatDialogModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        MessageService,
        ConfirmationService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StackingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
