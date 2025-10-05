import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { UtilService } from '../../../shared/services/util.service';
import { LOCATION_TYPES_OBJ } from '../../constants/location-types';
import { Location } from '../../models/location.model';
import { LocationStore } from './location.store';

@Injectable({ providedIn: 'root' })
export class LocationService {

  constructor(private store: LocationStore, private http: HttpClient,
              private utilService: UtilService) {
  }

  getSourceLocation(locationType: string) {
    const titleCaseLocationType = this.utilService.titleCase(locationType);
    const url = `${environment.apiUrl}/cats_core/locations?location_type=${titleCaseLocationType}`;
    return this.http.get(url)
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            this.store.update({sourceLocations: data});
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  getDestinationLocation(locationType: string) {
    const titleCaseLocationType = this.utilService.titleCase(locationType);
    const url = `${environment.apiUrl}/cats_core/locations?location_type=${titleCaseLocationType}`;
    return this.http.get(url)
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            this.store.update({destinationLocations: data});
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  get(locationType?: string, parent_id: number = null) {
    const {apiUrl} = environment;
    const index_url = locationType ? `${apiUrl}/cats_core/locations?location_type=${this.utilService.titleCase(locationType)}` : null;
    const child_url = parent_id ? `${apiUrl}/cats_core/locations/${parent_id}/children`: null;
    const url = child_url ? child_url : index_url;
    return this.http.get<Location[]>(url)
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            this.store.add(data);
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error?.error);
        })
      );
  }

  filter(filteringCriteria: any) {
    const url = `${environment.apiUrl}/cats_core/locations/filter`;
    return this.http.post(url, { q: filteringCriteria }).pipe(
        tap({ 
            next: ({success, data, error}: any) => {
                if (success) {
                    this.store.set(data);
                } else {
                    this.utilService.showAPIErrorResponse(error);
                }
            }, 
            error: error => {
                this.utilService.showAPIErrorResponse(error.error.error);
            }
        })
    );
  }

  add(payload: Location) {
    const fdpUrl = `${environment.apiUrl}/cats_core/locations/fdp/create`;
    const otherUrl = `${environment.apiUrl}/cats_core/locations`;
    const url = payload.location_type === LOCATION_TYPES_OBJ.FDP ? fdpUrl : otherUrl;
    return this.http.post(url, { payload })
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            this.store.add(data);
            this.utilService.showMessage('success', 'Success', 'Location registered successfully.');
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  update(id: number, payload: Partial<Location>) {
    const url = `${environment.apiUrl}/cats_core/locations/${id}`;
    return this.http.put(url, { payload })
      .pipe(
        tap(({success, data, error}: any) => {
          if (success) {
            this.store.update(id, data);
            this.utilService.showMessage('success', 'Success', 'Location updated successfully.');
          } else {
            this.utilService.showAPIErrorResponse(error);
          }
        }, error => {
          this.utilService.showAPIErrorResponse(error.error.error);
        })
      );
  }

  reset(): void {
    this.store.reset();
  }
}
