// Optimización de rutas usando algoritmo de vecino más cercano

import { Student, RouteStop } from './types';

// Función para calcular distancia entre dos puntos (fórmula de Haversine simplificada)
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Algoritmo de vecino más cercano para optimizar la ruta
export const optimizeRoute = (
  students: Student[],
  startLat: number = 4.6097, // Coordenadas de inicio (ejemplo: Bogotá)
  startLng: number = -74.0817
): RouteStop[] => {
  if (students.length === 0) return [];

  const unvisited = [...students];
  const route: RouteStop[] = [];
  let currentLat = startLat;
  let currentLng = startLng;
  let totalDistance = 0;

  while (unvisited.length > 0) {
    // Encontrar el estudiante más cercano
    let nearestIndex = 0;
    let minDistance = calculateDistance(currentLat, currentLng, unvisited[0].lat, unvisited[0].lng);

    for (let i = 1; i < unvisited.length; i++) {
      const distance = calculateDistance(currentLat, currentLng, unvisited[i].lat, unvisited[i].lng);
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = i;
      }
    }

    // Agregar a la ruta
    const nearestStudent = unvisited[nearestIndex];
    totalDistance += minDistance;
    
    // Calcular ETA aproximado (asumiendo 30 km/h promedio en ciudad)
    const timeInMinutes = Math.round((totalDistance / 30) * 60);
    const eta = `${Math.floor(timeInMinutes / 60)}h ${timeInMinutes % 60}m`;

    route.push({
      student: nearestStudent,
      order: route.length + 1,
      distance: minDistance,
      eta: eta
    });

    // Actualizar posición actual y remover de no visitados
    currentLat = nearestStudent.lat;
    currentLng = nearestStudent.lng;
    unvisited.splice(nearestIndex, 1);
  }

  return route;
};

// Geocodificación simulada para direcciones
export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number }> => {
  // En producción, esto usaría Google Maps Geocoding API
  // Por ahora, generamos coordenadas aleatorias cerca de Bogotá
  const baseLat = 4.6097;
  const baseLng = -74.0817;
  const randomOffset = () => (Math.random() - 0.5) * 0.1; // ~5km de variación

  return {
    lat: baseLat + randomOffset(),
    lng: baseLng + randomOffset()
  };
};
