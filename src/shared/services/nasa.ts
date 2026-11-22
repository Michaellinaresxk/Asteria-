import axios from 'axios';

export interface NasaImageItem {
  links?: Array<{ href: string }>;
}

export interface NasaSearchResponse {
  collection: {
    items: NasaImageItem[];
  };
}

const nasaClient = axios.create({
  baseURL: 'https://images-api.nasa.gov',
  timeout: 10000,
});

export async function searchPlanetImages(planet: string): Promise<NasaImageItem[]> {
  const { data } = await nasaClient.get<NasaSearchResponse>('/search', {
    params: {
      q: planet,
      media_type: 'image',
    },
  });

  return data.collection.items;
}
