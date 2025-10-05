import { TestBed } from '@angular/core/testing';
import { MenuService } from './menu.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { MessageService } from 'primeng/api';
import { MatDialogModule } from '@angular/material/dialog';

describe('MenuService', () => {
  let service: MenuService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule
      ],
      providers: [MessageService]
    });
    service = TestBed.inject(MenuService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch menus from server', () => {
    const url = `${environment.apiUrl}/cats_core/menus`;
    const response = { success: true, data: [{}] };

    service.get().subscribe(res => {
      expect(res).toEqual(response);
    });

    const testReq = httpMock.expectOne(url);
    expect(testReq.request.method).toBe('GET');
    testReq.flush(response);
    httpMock.verify();
  });

});
