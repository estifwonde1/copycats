import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { SessionQuery } from 'src/app/auth/state/session.query';

import { ReceiptAuthorizationComponent } from './receipt-authorization.component';

describe('ReceiptAuthorizationComponent', () => {
  let component: ReceiptAuthorizationComponent;
  let fixture: ComponentFixture<ReceiptAuthorizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiptAuthorizationComponent ],
      imports: [
        MatDialogModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        MessageService,
        { provide: SessionQuery, useValue: {userDetails: {hub: 19} } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
