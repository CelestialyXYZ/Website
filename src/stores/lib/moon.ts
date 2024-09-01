import { getGMST, julianDateFromUnixTime, raDecToAltAz } from "../lib/utils"

const toRad = Math.PI / 180.0
const toDeg = 180.0 / Math.PI

function constrain(d: number) {
  let t = d % 360
  if (t < 0) {
    t += 360
  }
  return t
}

export class ELP82 {
  //By Greg Miller gmiller@gregmiller.net http://www.celestialprogramming.com
  //Released as public domain

  //Chapront ELP2000/82 truncated implementation from Meeus
  //Input is T in Julian centuries since J2000 in Dynamical Time (T=(JDE-2451545)/36525)
  //Output is geocentric ecliptic longitude, latitude in degrees and distance in km
  static elp82(T: number) {
    const Lp =
      constrain(
        218.3164477 +
          481267.88123421 * T -
          0.0015786 * T * T +
          (1.0 / 538841.0) * T * T * T -
          (1.0 / 65194000.0) * T * T * T * T
      ) * toRad
    const D =
      constrain(
        297.8501921 +
          445267.1114034 * T -
          0.0018819 * T * T +
          (1.0 / 545868.0) * T * T * T -
          (1.0 / 113065000.0) * T * T * T * T
      ) * toRad
    const M =
      constrain(
        357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + (1.0 / 24490000.0) * T * T * T
      ) * toRad
    const Mp =
      constrain(
        134.9633964 +
          477198.8675055 * T +
          0.0087414 * T * T +
          (1.0 / 69699.0) * T * T * T -
          (1.0 / 14712000.0) * T * T * T * T
      ) * toRad
    const F =
      constrain(
        93.272095 +
          483202.0175233 * T -
          0.0036539 * T * T -
          (1.0 / 3526000.0) * T * T * T +
          (1.0 / 863310000.0) * T * T * T * T
      ) * toRad
    const E = 1 - 0.002516 * T - 0.0000074 * T * T
    const A1 = constrain(119.75 + 131.849 * T) * toRad
    const A2 = constrain(53.09 + 479264.29 * T) * toRad
    const A3 = constrain(313.45 + 481266.484 * T) * toRad

    const LongitudeRadius = [
      //D   M  Mp   F    Long     Radius
      [0, 0, 1, 0, 6288774, -20905335],
      [2, 0, -1, 0, 1274027, -3699111],
      [2, 0, 0, 0, 658314, -2955968],
      [0, 0, 2, 0, 213618, -569925],
      [0, 1, 0, 0, -185116, 48888],
      [0, 0, 0, 2, -114332, -3149],
      [2, 0, -2, 0, 58793, 246158],
      [2, -1, -1, 0, 57066, -152138],
      [2, 0, 1, 0, 53322, -170733],
      [2, -1, 0, 0, 45758, -204586],
      [0, 1, -1, 0, -40923, -129620],
      [1, 0, 0, 0, -34720, 108743],
      [0, 1, 1, 0, -30383, 104755],
      [2, 0, 0, -2, 15327, 10321],
      [0, 0, 1, 2, -12528, 0],
      [0, 0, 1, -2, 10980, 79661],
      [4, 0, -1, 0, 10675, -34782],
      [0, 0, 3, 0, 10034, -23210],
      [4, 0, -2, 0, 8548, -21636],
      [2, 1, -1, 0, -7888, 24208],
      [2, 1, 0, 0, -6766, 30824],
      [1, 0, -1, 0, -5163, -8379],
      [1, 1, 0, 0, 4987, -16675],
      [2, -1, 1, 0, 4036, -12831],
      [2, 0, 2, 0, 3994, -10445],
      [4, 0, 0, 0, 3861, -11650],
      [2, 0, -3, 0, 3665, 14403],
      [0, 1, -2, 0, -2689, -7003],
      [2, 0, -1, 2, -2602, 0],
      [2, -1, -2, 0, 2390, 10056],
      [1, 0, 1, 0, -2348, 6322],
      [2, -2, 0, 0, 2236, -9884],
      [0, 1, 2, 0, -2120, 5751],
      [0, 2, 0, 0, -2069, 0],
      [2, -2, -1, 0, 2048, -4950],
      [2, 0, 1, -2, -1773, 4130],
      [2, 0, 0, 2, -1595, 0],
      [4, -1, -1, 0, 1215, -3958],
      [0, 0, 2, 2, -1110, 0],
      [3, 0, -1, 0, -892, 3258],
      [2, 1, 1, 0, -810, 2616],
      [4, -1, -2, 0, 759, -1897],
      [0, 2, -1, 0, -713, -2117],
      [2, 2, -1, 0, -700, 2354],
      [2, 1, -2, 0, 691, 0],
      [2, -1, 0, -2, 596, 0],
      [4, 0, 1, 0, 549, -1423],
      [0, 0, 4, 0, 537, -1117],
      [4, -1, 0, 0, 520, -1571],
      [1, 0, -2, 0, -487, -1739],
      [2, 1, 0, -2, -399, 0],
      [0, 0, 2, -2, -381, -4421],
      [1, 1, 1, 0, 351, 0],
      [3, 0, -2, 0, -340, 0],
      [4, 0, -3, 0, 330, 0],
      [2, -1, 2, 0, 327, 0],
      [0, 2, 1, 0, -323, 1165],
      [1, 1, -1, 0, 299, 0],
      [2, 0, 3, 0, 294, 0],
      [2, 0, -1, -2, 0, 8752]
    ]

    const Latitude = [
      [0, 0, 0, 1, 5128122],
      [0, 0, 1, 1, 280602],
      [0, 0, 1, -1, 277693],
      [2, 0, 0, -1, 173237],
      [2, 0, -1, 1, 55413],
      [2, 0, -1, -1, 46271],
      [2, 0, 0, 1, 32573],
      [0, 0, 2, 1, 17198],
      [2, 0, 1, -1, 9266],
      [0, 0, 2, -1, 8822],
      [2, -1, 0, -1, 8216],
      [2, 0, -2, -1, 4324],
      [2, 0, 1, 1, 4200],
      [2, 1, 0, -1, -3359],
      [2, -1, -1, 1, 2463],
      [2, -1, 0, 1, 2211],
      [2, -1, -1, -1, 2065],
      [0, 1, -1, -1, -1870],
      [4, 0, -1, -1, 1828],
      [0, 1, 0, 1, -1794],
      [0, 0, 0, 3, -1749],
      [0, 1, -1, 1, -1565],
      [1, 0, 0, 1, -1491],
      [0, 1, 1, 1, -1475],
      [0, 1, 1, -1, -1410],
      [0, 1, 0, -1, -1344],
      [1, 0, 0, -1, -1335],
      [0, 0, 3, 1, 1107],
      [4, 0, 0, -1, 1021],
      [4, 0, -1, 1, 833],
      [0, 0, 1, -3, 777],
      [4, 0, -2, 1, 671],
      [2, 0, 0, -3, 607],
      [2, 0, 2, -1, 596],
      [2, -1, 1, -1, 491],
      [2, 0, -2, 1, -451],
      [0, 0, 3, -1, 439],
      [2, 0, 2, 1, 422],
      [2, 0, -3, -1, 421],
      [2, 1, -1, 1, -366],
      [2, 1, 0, 1, -351],
      [4, 0, 0, 1, 331],
      [2, -1, 1, 1, 315],
      [2, -2, 0, -1, 302],
      [0, 0, 1, 3, -283],
      [2, 1, 1, -1, -229],
      [1, 1, 0, -1, 223],
      [1, 1, 0, 1, 223],
      [0, 1, -2, -1, -220],
      [2, 1, -2, -1, -220],
      [1, 0, 1, 1, -185],
      [2, -1, -2, -1, 181],
      [0, 1, 2, 1, -177],
      [4, 0, -2, -1, 176],
      [4, -1, -1, -1, 166],
      [1, 0, 1, -1, -164],
      [4, 0, 1, -1, 132],
      [1, 0, -1, -1, -119],
      [4, -1, 0, -1, 115],
      [2, -2, 0, 1, 107]
    ]

    let Lon = 0
    let Radius = 0
    for (let i = 0; i < LongitudeRadius.length; i++) {
      const t = LongitudeRadius[i]
      const a = D * t[0] + M * t[1] + Mp * t[2] + F * t[3]

      let e = 1
      if (t[1] == 1 || t[1] == -1) {
        e = E
      }
      if (t[1] == 2 || t[1] == -2) {
        e = E * E
      }

      Lon += e * t[4] * Math.sin(a)
      Radius += e * t[5] * Math.cos(a)
    }

    let Lat = 0
    for (let i = 0; i < Latitude.length; i++) {
      const t = Latitude[i]
      const a = D * t[0] + M * t[1] + Mp * t[2] + F * t[3]

      let e = 1
      if (t[1] == 1 || t[1] == -1) {
        e = E
      }
      if (t[1] == 2 || t[1] == -2) {
        e = E * E
      }

      Lat += e * t[4] * Math.sin(a)
    }

    const aLon = 3958 * Math.sin(A1) + 1962 * Math.sin(Lp - F) + 318 * Math.sin(A2)
    const aLat =
      -2235 * Math.sin(Lp) +
      382 * Math.sin(A3) +
      175 * Math.sin(A1 - F) +
      175 * Math.sin(A1 + F) +
      127 * Math.sin(Lp - Mp) -
      115 * Math.sin(Lp + Mp)

    Lon = Lp * toDeg + (Lon + aLon) / 1000000
    Radius = 385000.56 + Radius / 1000
    Lat = (Lat + aLat) / 1000000

    return [Lon, Lat, Radius]
  }

  static JDEtoT(jde: number) {
    return (jde - 2451545) / 36525.0
  }
}

//Simplified nutation from Meeus P 144, accurate to 0.5"
//Reused fundamental argument equations from ELP 82 function.
function nutation(T: number) {
  const L = constrain(280.4665 + 36000.7698 * T) * toRad
  const Lp =
    constrain(
      218.3164477 +
        481267.88123421 * T -
        0.0015786 * T * T +
        (1.0 / 538841.0) * T * T * T -
        (1.0 / 65194000.0) * T * T * T * T
    ) * toRad
  const O =
    constrain(125.04452 - 1934.136261 * T + 0.0020708 * T * T + (1.0 / 450000) * T * T * T) * toRad

  const dPsi =
    -17.2 * Math.sin(O) - 1.32 * Math.sin(2 * L) - 0.23 * Math.sin(2 * Lp) + 0.21 * Math.sin(2 * O) //Meeus P 144
  const dEps =
    9.2 * Math.cos(O) + 0.57 * Math.cos(2 * L) + 0.1 * Math.cos(2 * Lp) - 0.09 * Math.cos(2 * O)

  return [dPsi, dEps]
}

function obliquity(T: number) {
  //const e0=84381.448 - 4680.93*T - 1.55*T*T + 1999.25*T*T*T - 51.38*T*T*T*T - 249.67*T*T*T*T*T + 39.05*T*T*T*T*T*T + 7.12*T*T*T*T*T*T*T + 27.87*T*T*T*T*T*T*T*T + 5.79*T*T*T*T*T*T*T*T*T + 2.45*T*T*T*T*T*T*T*T*T*T; //Meeus 22.3
  const eps0 = 84381.448 + -46.815 * T + -0.00059 * T * T + 0.001813 * T * T * T //Explanatory Supplement 3.222-1
  return eps0
}

function eclipticToEquitorial(ec: number[], T: number) {
  const n = nutation(T)
  const eps = ((obliquity(T) + n[1]) / 60.0 / 60.0) * toRad

  const lamda = (ec[0] + n[0] / 60 / 60) * toRad
  const B = ec[1] * toRad

  const ra = Math.atan2(
    Math.sin(lamda) * Math.cos(eps) - Math.tan(B) * Math.sin(eps),
    Math.cos(lamda)
  )
  const dec = Math.asin(Math.sin(B) * Math.cos(eps) + Math.cos(B) * Math.sin(eps) * Math.sin(lamda))

  return [ra * toDeg, dec * toDeg, ec[2]]
}

//Based on Meeus 40.2 and 40.3
function geocentric2Topocentric(
  equatorial: number[],
  longitude: number,
  latitude: number,
  altitude: number,
  JD: number
) {
  const ra = equatorial[0] * toRad
  const dec = equatorial[1] * toRad
  const radius = equatorial[2]

  const latitudeR = latitude * toRad

  //Meeus P 82
  const u = Math.atan(0.99664719 * Math.tan(latitudeR))
  const rs = 0.99664719 * Math.sin(u) + (altitude / 6378140) * Math.sin(latitudeR)
  const rc = Math.cos(u) + (altitude / 6378140) * Math.cos(latitudeR)

  const pi = Math.asin(6378.14 / radius)

  const gmst = getGMST(JD) * 15
  const H = (gmst - longitude - ra * toDeg) * toRad

  const dra = Math.atan2(
    -rc * Math.sin(pi) * Math.sin(H),
    Math.cos(dec) - rc * Math.sin(pi) * Math.cos(H)
  )

  const rap = constrain((ra + dra) * toDeg)
  const decp =
    Math.atan2(
      (Math.sin(dec) - rs * Math.sin(pi)) * Math.cos(dra),
      Math.cos(dec) - rc * Math.sin(pi) * Math.cos(H)
    ) * toDeg

  return [rap, decp, radius]
}

export function computePosition(dT: number, jd: number, lat: number, lon: number) {
  lon = -lon //ALERT!!!!  Meeus considers West longitudes to be positive, which is the opposite of how everything else uses it.

  const jde = jd + dT
  const T = ELP82.JDEtoT(jde)

  const ecliptic = ELP82.elp82(T)

  const equatorial = eclipticToEquitorial(ecliptic, T)

  const topocentric = geocentric2Topocentric(equatorial, lon, lat, 0, jde)

  const horizontal = raDecToAltAz(equatorial[0], equatorial[1], lat, lon, jd)

  return {
    geocentric: {
      ra: equatorial[0], //deg
      dec: equatorial[1] //deg
    },
    topocentric: {
      ra: topocentric[0], //deg
      dec: topocentric[1], //deg
      distance: topocentric[2] //km
    },
    horizontal: {
      az: horizontal[0], //deg,
      alt: horizontal[1] //deg
    }
  }
}
export function getImg(age: number) {
  if (age > 29.5) age = 29.5

  let img = Math.round(age * 8 + 1)
  if (img > 237) img = 237

  return `https://cdn.statically.io/gh/CelestialyXYZ/Images/main/images/moon/moon_${img}.jpg`
}

export function getAge(jd: number) {
  //Greg Miller (gmiller@gregmiller.net) 2022
  //Released as public domain
  //www.celestialprogramming.com

  const daysPerLunarMonth = 29.530588853

  let f = ((jd - 2451550.1) / daysPerLunarMonth) % 1
  f = f < 0 ? f + 1 : f

  return f * daysPerLunarMonth
}

export function getIlluminatedFraction(jd: number) {
  const toRad = Math.PI / 180.0
  const T = (jd - 2451545) / 36525.0

  const D =
    constrain(
      297.8501921 +
        445267.1114034 * T -
        0.0018819 * T * T +
        (1.0 / 545868.0) * T * T * T -
        (1.0 / 113065000.0) * T * T * T * T
    ) * toRad //47.2
  const M =
    constrain(
      357.5291092 + 35999.0502909 * T - 0.0001536 * T * T + (1.0 / 24490000.0) * T * T * T
    ) * toRad //47.3
  const Mp =
    constrain(
      134.9633964 +
        477198.8675055 * T +
        0.0087414 * T * T +
        (1.0 / 69699.0) * T * T * T -
        (1.0 / 14712000.0) * T * T * T * T
    ) * toRad //47.4

  //48.4
  const i =
    constrain(
      180 -
        (D * 180) / Math.PI -
        6.289 * Math.sin(Mp) +
        2.1 * Math.sin(M) -
        1.274 * Math.sin(2 * D - Mp) -
        0.658 * Math.sin(2 * D) -
        0.214 * Math.sin(2 * Mp) -
        0.11 * Math.sin(D)
    ) * toRad

  const k = ((1 + Math.cos(i)) / 2) * 100
  return k
}

export function getData(date: Date, lat: number, lon: number) {
  const jd = julianDateFromUnixTime(date)

  const currentMoonAge = getAge(jd)

  const data = {
    age: currentMoonAge,
    img: getImg(currentMoonAge),
    illumination: getIlluminatedFraction(jd),
    position: computePosition(68.6954, jd, lat, lon)
  }

  return data
}
