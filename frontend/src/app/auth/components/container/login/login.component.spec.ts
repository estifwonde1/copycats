import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { MessageService } from 'primeng/api';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { SessionService } from '../../../state/session.service';
import { environment } from '../../../../../environments/environment';
import { MatDialogModule } from '@angular/material/dialog';

class RouterStub {
  navigate() {}
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule
      ],
      declarations: [LoginComponent],
      providers: [
        SessionService,
        MessageService,
        { provide: Router, useClass: RouterStub },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should allow users to login', () => {
    const sessionService = TestBed.inject(SessionService);
    const credentials = {
        email: 'storekeeper@gmail.com',
        password: '123456'
    };

    const spy = spyOn(sessionService, 'login').and.returnValue(of({}));

    component.onSubmit(credentials);

    expect(spy).toHaveBeenCalledWith(credentials.email, credentials.password);
  });

  it('should redirect to home page after successful login', () => {
    const sessionService = TestBed.inject(SessionService);
    const router = TestBed.inject(Router);

    spyOn(sessionService, 'login').and.returnValue(of({}));
    const spy = spyOn(router, 'navigate');

    component.onSubmit({});
    expect(spy).toHaveBeenCalledWith(['/main']);
  });
});
