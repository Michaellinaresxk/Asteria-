export interface NearEarthObject {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD (close approach date)
  jplUrl: string;
  hazardous: boolean;
  distanceLunar: number;
  velocityKmS: number;
  diameterMinM: number;
  diameterMaxM: number;
}
