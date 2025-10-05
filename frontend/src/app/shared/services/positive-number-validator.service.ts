import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PositiveNumberValidatorService {

  constructor() { }

  positiveNumberValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if ((control.value as number) <= 0 && control.value !== null)
        return { invalidNumber: true };
      return null;
    };
  }
}
