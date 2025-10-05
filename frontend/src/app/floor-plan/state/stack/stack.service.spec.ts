import { TestBed } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { StackService } from './stack.sevice';
import { StoreStore } from '../../../setup/state/store/store.store';
import { Stack } from '../../models/stack.model';

describe('StackService', () => {
  let service: StackService;
  let httpMock: HttpTestingController;
  let storeStore: StoreStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
      ],
      providers: [
        MessageService,
      ]
    });
    service = TestBed.inject(StackService);
    httpMock = TestBed.inject(HttpTestingController);
    storeStore = TestBed.inject(StoreStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch stacking rules from server', () => {
    const url = `${environment.apiUrl}/cats_core/stores/1/stacks`;
    const response = { success: true, data: [{}] };

    service.get(1).subscribe(res => {
      expect(res).toEqual(response);
    });

    const testReq = httpMock.expectOne(url);
    expect(testReq.request.method).toBe('POST');
    testReq.flush(response);
    httpMock.verify();
  });

  it('should return stacks of a given store', () => {
    const stores = [{id: 1, stacks: [{id: 1}, {id: 2}]}]
    storeStore.update({currentUserStores: stores});
    const stacks = service.getStoreStacks({store_id: 1});
    expect(stacks.length).toEqual(2);
  });

  it('should add stack to store', () => {
    let stacks: Stack[] = [
      {id: 1, code: '1', length: 34, width: 34, height: 54, start_x: 0, start_y: 0, commodity_id: 1, store_id: 1, quantity: 1},
      {id: 2, code: '1', length: 34, width: 34, height: 54, start_x: 0, start_y: 0, commodity_id: 1, store_id: 1, quantity: 1},
    ];
    const newStack = {
      id: 2, code: '1', length: 34, width: 34, height: 54, start_x: 0, start_y: 0, commodity_id: 1, store_id: 1, quantity: 1};
    spyOn(service, 'getStoreStacks').and.returnValue(stacks);
    stacks.push(newStack);
    const spy = spyOn(service, 'updateCurrentUserStores');
    service.addStackToStore(newStack);
    expect(spy).toHaveBeenCalledWith(stacks, 1);
  });

});
