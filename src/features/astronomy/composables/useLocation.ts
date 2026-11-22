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

  async function requestGeolocation() {
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

    try {
      if ('permissions' in navigator && navigator.permissions?.query) {
        const status = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        if (status.state === 'denied') {
          locationError.value = 'El permiso de ubicación está bloqueado en el navegador. Habilítalo en la configuración del sitio.';
          locating.value = false;
          return;
        }
      }
    } catch {
      // permissions API not supported or failed; continue
    }

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
        const detail = err.message ? ` (${err.message})` : '';
        if (err.code === err.PERMISSION_DENIED) {
          locationError.value = `Permiso de ubicación denegado${detail}. Habilítalo en la configuración del sitio.`;
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          locationError.value = `Ubicación no disponible${detail}. Verifica los servicios de ubicación del sistema.`;
        } else if (err.code === err.TIMEOUT) {
          locationError.value = `Se agotó el tiempo para obtener la ubicación${detail}. Intenta de nuevo.`;
        } else {
          locationError.value = `No se pudo obtener tu ubicación${detail}.`;
        }
        locating.value = false;
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
  }

  onMounted(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      // keep default; user can opt-in to geolocation
    }
  });

  return { location, locating, locationError, saveLocation, requestGeolocation };
}
