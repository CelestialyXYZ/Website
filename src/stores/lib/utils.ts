export function julianDateFromUnixTime(t: any) {
  //Not valid for dates before Oct 15, 1582
  return t / 86400000 + 2440587.5
}

export function getGMST(ut1: number) {
  const D = ut1 - 2451545.0
  const T = D / 36525.0
  let gmst =
    (280.46061837 + 360.98564736629 * D + 0.000387933 * T * T - (T * T * T) / 38710000.0) % 360.0
  if (gmst < 0) {
    gmst += 360
  }
  return gmst / 15
}

//Greg Miller (gmiller@gregmiller.net) 2021
//Released as public domain
//http://www.celestialprogramming.com/

//All input and output angles are in radians, jd is Julian Date in UTC
export function raDecToAltAz(ra: number, dec: number, lat: number, lon: number, jd: number) {
  //Meeus 13.5 and 13.6, modified so West longitudes are negative and 0 is North
  const gmst = getGMST(jd)
  const localSiderealTime = (gmst + lon) % (2 * Math.PI)

  let H = localSiderealTime - ra
  if (H < 0) {
    H += 2 * Math.PI
  }
  if (H > Math.PI) {
    H = H - 2 * Math.PI
  }

  let az = Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(lat) - Math.tan(dec) * Math.cos(lat))
  const a = Math.asin(Math.sin(lat) * Math.sin(dec) + Math.cos(lat) * Math.cos(dec) * Math.cos(H))
  az -= Math.PI

  if (az < 0) {
    az += 2 * Math.PI
  }
  return [az, a, localSiderealTime, H]
}

export function getObjImgUrl(obj: any, res: String): string {
  let type = ""
  let name = ""
  if (obj.messier.length > 0) {
    type = "messier"
    name = Array.isArray(obj.messier)
      ? obj.messier[0].replace("M", "")
      : obj.messier.replace("M", "")
  } else if (obj.new_general_catalog.length > 0) {
    type = "ngc"
    name = Array.isArray(obj.new_general_catalog)
      ? obj.new_general_catalog[0].replace("NGC", "")
      : obj.new_general_catalog.replace("NGC", "")
  } else if (obj.index_catalog.length > 0) {
    type = "ic"
    name = Array.isArray(obj.index_catalog)
      ? obj.index_catalog[0].replace("IC", "")
      : obj.index_catalog.replace("IC", "")
  } else {
    return ""
  }

  return `https://cdn.statically.io/gh/CelestialyXYZ/Files/main/images/${type}/${res}/${type}_${name}.jpg`
}

export function getDsoMainIdentifier(obj: any) {
  let name = ""
  if (obj.messier.length > 0) {
    name = Array.isArray(obj.messier) ? obj.messier[0] : obj.messier
  } else if (obj.new_general_catalog.length > 0) {
    name = Array.isArray(obj.new_general_catalog)
      ? obj.new_general_catalog[0]
      : obj.new_general_catalog
  } else if (obj.index_catalog.length > 0) {
    name = Array.isArray(obj.index_catalog) ? obj.index_catalog[0] : obj.index_catalog
  } else {
    return ""
  }
  return name
}

export function getDsoName(obj: any) {
  if (obj.name_fr && obj.name_fr.trim() !== "") {
    return obj.name_fr
  } else if (obj.name_en && obj.name_en.trim() !== "") {
    return obj.name_en
  } else if (obj.name_extra && obj.name_extra.length > 0) {
    return obj.name_extra[0] // Take the first entry in the name_extra array
  }
  return getDsoMainIdentifier(obj) // Return null if no name is available
}

export function getCstImgUrl(iauCode: string): string {
  return `https://cdn.statically.io/gh/CelestialyXYZ/Files/main/images/constellations/jpg/${iauCode}.jpg`
}

// Helper function to convert a decimal coordinate to degrees, minutes, and seconds
export function toDMS(coordinate: number): [number, number, number] {
  const absolute = Math.abs(coordinate)
  const degrees = Math.floor(absolute)
  const minutesNotTruncated = (absolute - degrees) * 60
  const minutes = Math.floor(minutesNotTruncated)
  const seconds = (minutesNotTruncated - minutes) * 60
  return [degrees, minutes, seconds]
}

// Function to convert latitude to sexagesimal format
export function latitudeatitudeToSexagesimal(lat: number): string {
  const [latDegrees, latMinutes, latSeconds] = toDMS(lat)
  const latDirection = lat >= 0 ? "N" : "S"
  return `${latDirection}${latDegrees}° ${latMinutes}' ${latSeconds.toFixed(3)}''`
}

// Function to convert longitude to sexagesimal format
export function longitudeToSexagesimal(lon: number): string {
  const [lonDegrees, lonMinutes, lonSeconds] = toDMS(lon)
  const lonDirection = lon >= 0 ? "E" : "W"
  return `${lonDirection}${lonDegrees}° ${lonMinutes}' ${lonSeconds.toFixed(2)}''`
}
