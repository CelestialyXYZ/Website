function getGMSTjd(jd: number) {
  const T = (jd - 2451545.0) / 36525.0
  let st =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000.0
  st = st % 360
  if (st < 0) {
    st += 360
  }

  return st
  //return st*Math.PI/180.0;
}

const toRad = Math.PI / 180.0
const toDeg = 180.0 / Math.PI

//Corrects values to make them between 0 and 1
function constrain(v: number) {
  if (v < 0) {
    return v + 1
  }
  if (v > 1) {
    return v - 1
  }
  console.log(v)
  return v
}

export interface Dso {
  name_fr?: string
  name_en?: string
  name_extra?: string[]
  type?: string
  constellation?: {} //TODO: A remplir
  major_axis?: number
  minor_axis?: number
  position_angle?: number
  b_magnitude?: number
  v_magnitude?: number
  j_magnitude?: number
  h_magnitude?: number
  k_magnitude?: number
  surface_brightness?: number
  hubble_type?: string
  parallax?: number
  proper_motion_ra?: number
  proper_motion_dec?: number
  radial_velocity?: number
  redshift?: number
  common_star_u_mag?: number
  common_star_b_mag?: number
  common_star_v_mag?: number
  messier?: string[]
  new_general_catalog?: string[]
  index_catalog?: string[]
  common_star_names?: string[]
  identifiers?: string[]
  ned_notes?: string[]
  open_ngc_notes?: string[]
  sources?: string
  right_ascension?: number
  declination?: number
  modules?: string[]
}

export interface Observer {
  latitude: number
  longitude: number
}

export class dsoObject {
  dso: Dso
  observer: Observer
  constructor(dso: Dso, observer: Observer) {
    this.dso = dso
    this.observer = observer
  }
  getRiseSet(date: Date, h0 = -0.5667): { rise: number | 0; transit: number | 0; set: number | 0 } {
    //check if we have enough values to continue
    if (
      this.dso.right_ascension &&
      this.dso.declination &&
      this.observer.latitude &&
      this.observer.latitude
    ) {
      const cosH0 =
        (Math.sin((h0 * Math.PI) / 180.0) -
          Math.sin(this.observer.latitude) * Math.sin(this.dso.declination)) /
        (Math.cos(this.observer.latitude) * Math.cos(this.dso.declination))
      const H0 = (Math.acos(cosH0) * 180) / Math.PI

      const gmst =
        getGMSTjd(
          Math.floor(date.getTime() / 86400000 - date.getTimezoneOffset() / 1440 + 2440587.5)
        ) + 0.5

      console.log({
        latitude: this.observer.latitude,
        longitude: this.observer.longitude,
        declination: this.dso.declination,
        ra: this.dso.right_ascension,
        jd: gmst
      })

      const transit =
        (this.dso.right_ascension * toDeg + this.observer.longitude * toDeg - gmst) / 360.0
      const rise = transit - H0 / 360.0
      const set = transit + H0 / 360.0

      return {
        rise: constrain(rise) * 24.0,
        transit: constrain(transit) * 24.0,
        set: constrain(set) * 24.0
      }
    } else {
      return { rise: 0, transit: 0, set: 0 }
    }
  }
}
