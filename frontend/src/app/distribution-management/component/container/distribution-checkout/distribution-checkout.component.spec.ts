import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';

import { DistributionCheckoutComponent } from './distribution-checkout.component';

describe('DistributionCheckoutComponent', () => {
  let component: DistributionCheckoutComponent;
  let fixture: ComponentFixture<DistributionCheckoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistributionCheckoutComponent ],
      imports: [
        MatDialogModule,
        HttpClientTestingModule
      ],
      providers: [
        MessageService,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DistributionCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
