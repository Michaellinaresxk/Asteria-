export interface UserLocation {
  latitude: number;
  longitude: number;
  label: string;
}

export interface SunTimes {
  sunrise: string;
  sunset: string;
  solarNoon: string;
  civilTwilightBegin: string;
  civilTwilightEnd: string;
  dayLengthSeconds: number;
}
