import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PasswordConfirmationService {

  constructor() { }

  passwordValidator(): ValidatorFn {
    return(control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
    
      return value === control.parent?.get('password')?.value ? null : { passwordMatch: true };
    }
  }
}
