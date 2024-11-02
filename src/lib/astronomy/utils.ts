/**
 * Converts a coordinate given in decimal degrees to a
 * three-element array containing the degrees, minutes, and
 * seconds as integers.
 *
 * @param {number} coordinate - decimal coordinate
 * @returns {Array<number, number, number>} a three-element array
 *          containing the degrees, minutes, and seconds as
 *          integers.
 */
export function toDMS(coordinate: number): [number, number, number] {
  const absolute = Math.abs(coordinate)
  const degrees = Math.floor(absolute)
  const minutesNotTruncated = (absolute - degrees) * 60
  const minutes = Math.floor(minutesNotTruncated)
  const seconds = (minutesNotTruncated - minutes) * 60
  return [degrees, minutes, seconds]
}

/**
 * Converts a declination coordinate given in decimal degrees to a
 * string in the format of degrees, minutes and seconds.
 *
 * @param {number} declination - decimal declination coordinate
 * @returns {string} a string in the format of degrees, minutes and seconds
 */
export function decToDMS(declination: number): string {
  const degrees = Math.floor(declination)
  const minutes = Math.floor((declination - degrees) * 60)
  const seconds = (declination - degrees - minutes / 60) * 3600
  return `${degrees}° ${minutes}' ${Math.round(seconds)}" `
}

/**
 * Converts a right ascension coordinate given in decimal hours to a
 * string in the format of hours, minutes and seconds.
 *
 * @param {number} right_ascension - decimal right ascension coordinate
 * @returns {string} a string in the format of hours, minutes and seconds
 */
export function raToHMS(right_ascension: number): string {
  const hours = Math.floor(right_ascension)
  const minutes = Math.floor((right_ascension - hours) * 60)
  const seconds = (right_ascension - hours - minutes / 60) * 3600
  return `${hours}h ${minutes}m ${Math.round(seconds)}s `
}

/**
 * Converts a latitude coordinate given in decimal degrees to a
 * string in the format of degrees, minutes and seconds.
 *
 * @param {number} lat - decimal latitude coordinate
 * @returns {string} a string in the format of degrees, minutes and seconds
 */
export function latitudeatitudeToSexagesimal(lat: number): string {
  const [latDegrees, latMinutes, latSeconds] = toDMS(lat)
  const latDirection = lat >= 0 ? "N" : "S"
  return `${latDirection}${latDegrees}° ${latMinutes}' ${latSeconds.toFixed(3)}''`
}

/**
 * Converts a longitude coordinate given in decimal degrees to a
 * string in the format of degrees, minutes and seconds.
 *
 * @param {number} lon - decimal longitude coordinate
 * @returns {string} a string in the format of degrees, minutes and seconds
 */
export function longitudeToSexagesimal(lon: number): string {
  const [lonDegrees, lonMinutes, lonSeconds] = toDMS(lon)
  const lonDirection = lon >= 0 ? "E" : "W"
  return `${lonDirection}${lonDegrees}° ${lonMinutes}' ${lonSeconds.toFixed(2)}''`
}

export function azimuthToDirection(azimuth: number, returnOnlyLetters: boolean = true): string {
  let modAzimuth: number = azimuth % 360
  if (modAzimuth < 0) {
    modAzimuth += 360
  }

  if (modAzimuth >= 337.5 || modAzimuth < 22.5) return returnOnlyLetters ? "N" : "Nord"
  if (modAzimuth >= 22.5 && modAzimuth < 67.5) return returnOnlyLetters ? "NE" : "Nord-Est"
  if (modAzimuth >= 67.5 && modAzimuth < 112.5) return returnOnlyLetters ? "E" : "Est"
  if (modAzimuth >= 112.5 && modAzimuth < 157.5) return returnOnlyLetters ? "SE" : "Sud-Est"
  if (modAzimuth >= 157.5 && modAzimuth < 202.5) return returnOnlyLetters ? "S" : "Sud"
  if (modAzimuth >= 202.5 && modAzimuth < 247.5) return returnOnlyLetters ? "SO" : "Sud-Ouest"
  if (modAzimuth >= 247.5 && modAzimuth < 292.5) return returnOnlyLetters ? "O" : "Ouest"
  if (modAzimuth >= 292.5 && modAzimuth < 337.5) return returnOnlyLetters ? "NO" : "Nord-Ouest"
  return "" // En cas de valeur en dehors de 0-360
}
