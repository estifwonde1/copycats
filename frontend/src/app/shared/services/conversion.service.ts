import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class ConversionService {
    constructor() {}

    convert(conversionFactors: any = [], fromId: number, toId: number, value: number) {
        if(fromId === toId) {
            return value;
        }
        let result = conversionFactors.find((cf: any) => cf.from_id === fromId && cf.to_id === toId);
        if(result) {
            return value * result.factor;
        }
        result = conversionFactors.find((cf: any) => cf.from_id === toId && cf.to_id === fromId);
        if(result) {
            return value / result.factor;
        }
        return -1;
    }

}
