import { onMounted, ref } from 'vue';

import type { UserLocation } from '@/shared/types/location';

const STORAGE_KEY = 'astronomy-location';

const DEFAULT_LOCATION: UserLocation = {
  latitude: 19.4326,
  longitude: -99.1332,
  label: 'Ciudad de México',
};

function loadLocation(): UserLocation {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_LOCATION;
    const parsed = JSON.parse(raw) as UserLocation;
    if (typeof parsed.latitude === 'number' && typeof parsed.longitude === 'number' && parsed.label) {
      return parsed;
    }
  } catch {
    // ignore invalid storage
  }
  return DEFAULT_LOCATION;
}

export function useLocation() {
  const location = ref<UserLocation>(loadLocation());
  const locating = ref(false);
  const locationError = ref('');

  function saveLocation(next: UserLocation) {
    location.value = next;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    locationError.value = '';
  }

  function requestGeolocation() {
    if (!navigator.geolocation) {
      locationError.value = 'La geolocalización no está disponible en este navegador.';
      return;
    }
    if (!window.isSecureContext) {
      locationError.value = 'La geolocalización requiere HTTPS o localhost. Ingresa tu ubicación manualmente.';
      return;
    }

    locating.value = true;
    locationError.value = '';
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        saveLocation({
          latitude: Number(pos.coords.latitude.toFixed(4)),
          longitude: Number(pos.coords.longitude.toFixed(4)),
          label: 'Mi ubicación',
        });
        locating.value = false;
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          locationError.value = 'Permiso de ubicación denegado. Habilítalo en el navegador o ingresa tu ubicación manualmente.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          locationError.value = 'Tu ubicación no está disponible en este momento. Intenta de nuevo o ingrésala manualmente.';
        } else if (err.code === err.TIMEOUT) {
          locationError.value = 'Se agotó el tiempo para obtener tu ubicación. Intenta de nuevo.';
        } else {
          locationError.value = 'No se pudo obtener tu ubicación. Puedes ingresarla manualmente.';
        }
        locating.value = false;
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }

  onMounted(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      // keep default; user can opt-in to geolocation
    }
  });

  return { location, locating, locationError, saveLocation, requestGeolocation };
}
