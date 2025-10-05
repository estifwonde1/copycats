
export interface Store {
  name: string;
  width: number;
  length: number;
  places: Place[];
}

interface Place {
  name: string;
  width: number;
  length: number;
  upperLeftCorner: UpperLeftCorner
}

interface UpperLeftCorner {
  x: number;
  y: number;
}
