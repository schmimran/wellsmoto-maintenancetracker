
/**
 * Utility functions for distance conversions
 */

/**
 * Convert miles to kilometers
 */
export const milesToKilometers = (miles: number): number => {
  return miles * 1.60934;
};

/**
 * Convert kilometers to miles
 */
export const kilometersToMiles = (km: number): number => {
  return km / 1.60934;
};

/**
 * Format distance based on user's preferred unit
 */
export const formatDistance = (miles: number, unit: 'miles' | 'kilometers' = 'miles'): string => {
  if (unit === 'kilometers') {
    return `${Math.round(milesToKilometers(miles) * 10) / 10} km`;
  }
  return `${Math.round(miles * 10) / 10} mi`;
};
