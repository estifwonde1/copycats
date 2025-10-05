import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import { RoundPlanCompletionComponent } from './round-plan-completion.component';

describe('RoundPlanCompletionComponent', () => {
  let component: RoundPlanCompletionComponent;
  let fixture: ComponentFixture<RoundPlanCompletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundPlanCompletionComponent ],
      imports: [ 
        HttpClientTestingModule,
        MatDialogModule,
       ],
      providers: [ 
        MessageService,
        ConfirmationService
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoundPlanCompletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
