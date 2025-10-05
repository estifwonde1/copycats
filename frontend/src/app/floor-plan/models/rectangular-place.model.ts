export interface RectangularPlace {
  left: number;
  right: number;
  top: number;
  bottom: number;
  type?: string;
  color?: string;
}

export const EMPTY_RECTANGULAR_PLACE: RectangularPlace = {
  left: null,
  right: null,
  top: null,
  bottom: null
}
