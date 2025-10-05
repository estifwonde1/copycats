import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({ providedIn: 'root'})
export class RoundsValidationService {
  constructor() { }

  roundsFormatValidator(): ValidatorFn {
    return(control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if(!value) {
        return null;
      }
      
      let lastValue: any = null;
      if(!(value instanceof Array)) {
        lastValue = value[value.length - 1];
      }

      return lastValue !== ',' ? null : { invalidRoundsFormat: true };
    }
  }

}
