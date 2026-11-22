export interface VisiblePlanet {
  name: string;
  constellation: string;
  altitude: number;
  azimuth: number;
  magnitude: number;
  nakedEyeObject: boolean;
}

export interface VisiblePlanetsResponse {
  data: VisiblePlanet[];
}
