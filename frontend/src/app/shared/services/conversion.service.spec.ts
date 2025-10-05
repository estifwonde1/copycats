import { TestBed } from '@angular/core/testing';
import { ConversionService } from './conversion.service';


describe('ConversionService', () => {
  let service: ConversionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConversionService]
    });
    service = TestBed.inject(ConversionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('returns forward conversion value if conversion factor exists', () => {
    const unitConversions = [
        { from_id: 2, to_id: 3, factor: 3 },
        { from_id: 1, to_id: 2, factor: 0.01 }
    ]
    const result = service.convert(unitConversions, 1, 2, 200);
    expect(result).toBe(2);
  });

  it('returns backward conversion value if conversion factor exists', () => {
    const unitConversions = [
        { from_id: 2, to_id: 3, factor: 3 },
        { from_id: 1, to_id: 2, factor: 0.01 }
    ]
    const result = service.convert(unitConversions, 2, 1, 1);
    expect(result).toBe(100);
  });

  it('returns -1 if conversion factor does not exists', () => {
    const unitConversions = [
        { from_id: 2, to_id: 3, factor: 3 },
        { from_id: 1, to_id: 2, factor: 0.01 }
    ]
    const result = service.convert(unitConversions, 4, 1, 1);
    expect(result).toBe(-1);
  });
});
