import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { SessionQuery } from 'src/app/auth/state/session.query';
import { DispatchAuthorizationComponent } from './dispatch-authorization.component';

describe('DispatchAuthorizationComponent', () => {
  let component: DispatchAuthorizationComponent;
  let fixture: ComponentFixture<DispatchAuthorizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchAuthorizationComponent ],
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
    fixture = TestBed.createComponent(DispatchAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
