import { Injectable } from '@angular/core';
import { Store } from '../../setup/models/store.model';
import { UtilService } from '../../shared/services/util.service';
import { RectangularPlace } from '../models/rectangular-place.model';

@Injectable({
  providedIn: 'root'
})
export class OperationService {

  constructor(private utilService: UtilService) { }

  isFarFromWall(place: RectangularPlace, distanceFromWall: number, store: Store): boolean {
    const isFarFromWall = (
      place?.left >= distanceFromWall &&
      place?.right <= store?.length - distanceFromWall &&
      place?.top >= distanceFromWall &&
      place?.bottom <= store?.width - distanceFromWall
     );
     if (place && !isFarFromWall) {
       this.utilService.showAPIErrorResponse('No enough space from the wall.');
     }
    return isFarFromWall;
  }

  isOverMaximumLength(place: RectangularPlace, maximumLength: number): boolean {
    const isOverMaximumLength = place?.right - place?.left > maximumLength;
    if (isOverMaximumLength) {
      this.utilService.showAPIErrorResponse(`Length shouldn't be greater than ${maximumLength}.`);
    }
    return isOverMaximumLength;
  }

  isOverMaximumWidth(place: RectangularPlace, maximumWidth: number): boolean {
    const isOverMaximumWidth = place?.bottom - place?.top > maximumWidth;
    if (isOverMaximumWidth) {
      this.utilService.showAPIErrorResponse(`Width shouldn't be greater than ${maximumWidth}.`);
    }
    return isOverMaximumWidth;
  }

  doOverlapToExistingPlaces(newPlace: RectangularPlace, places: RectangularPlace[]): boolean {
    let doOverlap = false;
    for (const place of places) {
      doOverlap = this.doOverlap(newPlace, place);
      if (doOverlap) {
        break;
      }
    }
    if (newPlace && doOverlap) {
      this.utilService.showAPIErrorResponse('No enough space between the stacks.');
    }
    return doOverlap;
  }

  doOverlap(rect1: RectangularPlace, rect2: RectangularPlace): boolean {
    const r1 = [[rect1?.left, rect1?.top], [rect1?.right, rect1?.bottom]];
    const r2 = [[rect2?.left, rect2?.top], [rect2?.right, rect2?.bottom]];

    const appearOnRight = r1[0][0] >= r2[1][0];
    const appearOnLeft = r2[0][0] >= r1[1][0];
    const appearOnTop = r2[0][1] >= r1[1][1];
    const appearOnBottom = r1[0][1] >= r2[1][1];
    if (appearOnRight || appearOnLeft) {
      return false;
    }
    if (appearOnTop || appearOnBottom) {
      return false;
    }
    return true;
  }

  isFarFromOtherPlaces(newPlace: RectangularPlace, spaceBetweenStack: number, places: RectangularPlace[]): boolean {
    const extendedNewPlace: RectangularPlace = {
      left: newPlace?.left - spaceBetweenStack,
      top: newPlace?.top - spaceBetweenStack,
      right: newPlace?.right + spaceBetweenStack,
      bottom: newPlace?.bottom + spaceBetweenStack
    };

    return !this.doOverlapToExistingPlaces(extendedNewPlace, places);
  }


  getTooltipContent(content: any): string {
    return  (
      `<h3>Code: ${content?.code|| '-'}</h3>
        <h3>Width: ${content?.width|| '-'}</h3>
        <h3>Length: ${content?.length|| '-'}</h3>
        <h3>Height: ${content?.height || '-'}</h3>
        <h3>Start x: ${content?.start_x|| '-'}</h3>
        <h3>Start y: ${content?.start_y|| '-'}</h3>
        <h3>Commodity batch no: ${content?.commodity_batch_no|| '-'}</h3>
      `
      )
  }

}
