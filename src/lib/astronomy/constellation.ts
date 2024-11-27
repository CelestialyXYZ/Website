import {
  Observer,
  Horizon,
  DefineStar,
  GeoVector,
  AngleBetween,
  Body,
  SearchRiseSet,
  SearchAltitude
} from "astronomy-engine"
import { raToHMS, decToDMS } from "./utils"
import moment, { type Moment } from "moment"
import type { ConstObject, CulminationDateCoords } from "@/declare"

export class Constellation {
  constellation: ConstObject
  observer: Observer
  constructor(constellation: ConstObject, observer: Observer) {
    this.constellation = constellation
    this.observer = observer
  }
  /**
   * Returns the URL of an image of the DSO, either from the Messier, NGC or IC catalogs.
   * @param res The resolution of the image, either 1920x1080, 1280x900 or 500x300.
   * @returns The URL of the image, or an empty string if the DSO is not in any of the catalogs.
   */
  getImg(): string {
    return `https://cdn.statically.io/gh/CelestialyXYZ/Astronomy-images/main/images/constellations/jpg/${this.constellation.iau_code}.jpg`
  }
  /**
   * Calculates the altitude and azimuth of the deep sky object for a given date at the observer's location.
   * @param {Date} date The date at which to calculate the position of the object.
   * @returns {{ altitude: number, azimuth: number }} An object with the altitude and azimuth of the object at the given date.
   */
  getAltAz(date: Moment): { altitude: number; azimuth: number } {
    //setting the right ascension max digits after comma otherwise it causes an infinite number error from astronomy-engine library
    const rightAscension = this.constellation.right_ascension
      ? parseFloat(this.constellation.right_ascension.toFixed(6))
      : 0
    const declination = this.constellation.declination
      ? parseFloat(this.constellation.declination.toFixed(6))
      : 0

    const { altitude, azimuth } = Horizon(
      date.toDate(),
      this.observer,
      rightAscension,
      declination,
      "normal"
    )

    return { altitude, azimuth }
  }
  /**
   * Converts the right ascension of the deep sky object to a string formatted
   * in hours, minutes, and seconds.
   *
   * @returns {string} The right ascension as a string in the format "h mm ss".
   */
  getRaHMS(): string {
    return raToHMS(this.constellation.right_ascension || 0)
  }
  /**
   * Converts the declination of the deep sky object to a string formatted
   * in degrees, minutes, and seconds.
   *
   * @returns {string} The declination as a string in the format "+/-dd mm ss".
   */
  getDecHMS(): string {
    return decToDMS(this.constellation.declination || 0)
  }
  /**
   * Generates an array of objects representing the sky path of the deep sky
   * object over a 24 hour period. The array will contain `step` number of
   * elements, each representing the position of the object in the sky at a
   * given hour of the day.
   *
   * @param {number} step The number of elements in the array, which also
   *                      represents the number of hours in the day at which the
   *                      object's position will be calculated.
   * @returns {{ altitude: number; azimuth: number; time: Date; hour: number }[]}
   *          An array of objects, each containing the altitude and azimuth of
   *          the object at a given hour of the day, as well as the time and hour
   *          of the day.
   */
  getSkyPath(
    date: Moment,
    step: number
  ): { altitude: number; azimuth: number; time: Moment; hour: number }[] {
    const dateOfDay = moment(date).startOf("day").set("hours", 12) // Start from 12 pm on the current day
    const numberOfSteps = Math.floor(24 / step)

    //setting the right ascension max digits after comma otherwise it causes an infinite number error from astronomy-engine library
    const rightAscension = this.constellation.right_ascension
      ? parseFloat(this.constellation.right_ascension.toFixed(6))
      : 0
    const declination = this.constellation.declination
      ? parseFloat(this.constellation.declination.toFixed(6))
      : 0

    // Generate a time array for calculating positions
    const times: Moment[] = []

    // Add dates from 12 pm to 12 am to time array (first loop)
    for (let i = 0; i <= numberOfSteps; i++) {
      times.push(dateOfDay.clone().add(i * step, "hours"))
    }

    // Store paths in a list
    const path: { altitude: number; azimuth: number; time: Moment; hour: number }[] = []

    times.forEach((time) => {
      const { altitude, azimuth } = Horizon(
        time.toDate(),
        this.observer,
        rightAscension,
        declination,
        "normal"
      )

      path.push({
        altitude,
        azimuth,
        time,
        hour: time.hours() + time.minutes() / 60
      })
    })

    return path
  }
  /**
   * Calculates the angle between the Moon and the DSO object on a given date.
   *
   * @param {Moment} date The date at which to calculate the angle.
   * @returns {number} The angle between the Moon and the DSO object in degrees.
   */
  getAngleFromMoon(date: Moment): number {
    //setting the right ascension max digits after comma otherwise it causes an infinite number error from astronomy-engine library
    const rightAscension = this.constellation.right_ascension
      ? parseFloat(this.constellation.right_ascension.toFixed(6))
      : 0
    const declination = this.constellation.declination
      ? parseFloat(this.constellation.declination.toFixed(6))
      : 0

    DefineStar(Body.Star1, rightAscension, declination, 1000) //Setting default distance to 1000 AL, the value will generally work well

    const moonGeoVector = GeoVector(Body.Moon, date.toDate(), true)
    const dsoGeoVector = GeoVector(Body.Star1, date.toDate(), true)

    return AngleBetween(moonGeoVector, dsoGeoVector)
  }
  /**
   * Calculates the rise time of the object for a given date at the observer's location.
   *
   * @param {Moment} date The date at which to calculate the rise time.
   * @returns {Moment} The rise time as a Moment object.
   */
  getRise(date: Moment): Moment | null {
    //setting the right ascension max digits after comma otherwise it causes an infinite number error from astronomy-engine library
    const rightAscension = this.constellation.right_ascension
      ? parseFloat(this.constellation.right_ascension.toFixed(6))
      : 0
    const declination = this.constellation.declination
      ? parseFloat(this.constellation.declination.toFixed(6))
      : 0

    DefineStar(Body.Star1, rightAscension, declination, 1000) //Setting default distance to 1000 AL, the value will generally work well

    const rise = SearchRiseSet(Body.Star1, this.observer, +1, date.startOf("day").toDate(), 1)?.date

    if (rise) {
      return moment(rise)
    } else {
      return null
    }
  }
  /**
   * Calculates the set time of the object for a given date at the observer's location.
   *
   * @param {Moment} date The date at which to calculate the set time.
   * @returns {Moment} The set time as a Moment object.
   */
  getSet(date: Moment): Moment | null {
    //setting the right ascension max digits after comma otherwise it causes an infinite number error from astronomy-engine library
    const rightAscension = this.constellation.right_ascension
      ? parseFloat(this.constellation.right_ascension.toFixed(6))
      : 0
    const declination = this.constellation.declination
      ? parseFloat(this.constellation.declination.toFixed(6))
      : 0

    DefineStar(Body.Star1, rightAscension, declination, 1000) //Setting default distance to 1000 AL, the value will generally work well

    const set = SearchRiseSet(Body.Star1, this.observer, -1, date.startOf("day").toDate(), 1)?.date

    if (set) {
      return moment(set)
    } else {
      return null
    }
  }

  /**
   * Calculates the culmination time of the constellation object for a given date at the observer's location.
   *
   * @param {Moment} date - The date at which to calculate the culmination time.
   * @param {number} [step=0.25] - The step size in hours for generating the sky path.
   * @returns {CulminationDateCoords} - An object containing the culmination time as a Moment object, as well as the right ascension, declination, altitude and azimuth at the culmination point.
   */
  getCulmination(date: Moment, step: number = 0.25): CulminationDateCoords {
    const skyPath = this.getSkyPath(date, step)

    //setting the right ascension max digits after comma otherwise it causes an infinite number error from astronomy-engine library
    const rightAscension = this.constellation.right_ascension
      ? parseFloat(this.constellation.right_ascension.toFixed(6))
      : 0
    const declination = this.constellation.declination
      ? parseFloat(this.constellation.declination.toFixed(6))
      : 0

    const culmination = skyPath.reduce((maxPos, currentPos) => {
      return currentPos.altitude > maxPos.altitude ? currentPos : maxPos
    }, skyPath[0])

    const result: CulminationDateCoords = {
      date: culmination.time,
      coords: {
        ra: rightAscension,
        dec: declination,
        altitude: culmination.altitude,
        azimuth: culmination.azimuth
      }
    }

    return result
  }

  /**
   * Calculates the rise time of the object at a given date and altitude above the horizon at the observer's location.
   * @param {Moment} date The date at which to calculate the rise time.
   * @param {number} altitude The altitude above the horizon (in degrees) at which to calculate the rise time.
   * @returns {Moment | null} The rise time as a Moment object, or null if the object does not rise above the given altitude on the given date.
   */
  getRiseAltitude(date: Moment, altitude: number): Moment | null {
    //setting the right ascension max digits after comma otherwise it causes an infinite number error from astronomy-engine library
    const rightAscension = this.constellation.right_ascension
      ? parseFloat(this.constellation.right_ascension.toFixed(6))
      : 0
    const declination = this.constellation.declination
      ? parseFloat(this.constellation.declination.toFixed(6))
      : 0

    DefineStar(Body.Star1, rightAscension, declination, 1000) //Setting default distance to 1000 AL, the value will generally work well

    const rise = SearchAltitude(
      Body.Star1,
      this.observer,
      +1,
      date.startOf("day").toDate(),
      1,
      altitude
    )?.date

    if (rise) {
      return moment(rise)
    } else {
      return null
    }
  }
  /**
   * Calculates the set time of the object at the given altitude for a given date at the observer's location.
   *
   * @param {Moment} date The date at which to calculate the set time.
   * @param {number} altitude The altitude at which to calculate the set time.
   * @returns {Moment | null} The set time as a Moment object, or null if the object does not set at the given altitude.
   */
  getSetAltitude(date: Moment, altitude: number): Moment | null {
    //setting the right ascension max digits after comma otherwise it causes an infinite number error from astronomy-engine library
    const rightAscension = this.constellation.right_ascension
      ? parseFloat(this.constellation.right_ascension.toFixed(6))
      : 0
    const declination = this.constellation.declination
      ? parseFloat(this.constellation.declination.toFixed(6))
      : 0

    DefineStar(Body.Star1, rightAscension, declination, 1000) //Setting default distance to 1000 AL, the value will generally work well

    const set = SearchAltitude(
      Body.Star1,
      this.observer,
      -1,
      date.startOf("day").toDate(),
      1,
      altitude
    )?.date

    if (set) {
      return moment(set)
    } else {
      return null
    }
  }

  /**
   * Returns true if the object is visible all day at the given date.
   * An object is considered visible all day if it never rises or sets.
   * @param {Moment} date The date at which to check the visibility of the object.
   * @returns {boolean} True if the object is visible all day at the given date.
   */
  isVisibleAllDay(date: Moment): boolean {
    return !this.getRise(date) && !this.getSet(date)
  }
  /**
   * Determines if the object is not visible at any time of the day at a given altitude.
   * An object is considered not visible if it neither rises nor sets at the specified altitude.
   *
   * @param {Moment} date The date at which to check the visibility of the object.
   * @param {number} altitude The altitude above the horizon (in degrees) to check for visibility.
   * @returns {boolean} True if the object is not visible at any time of the day at the given altitude.
   */
  isAltitudeVisible(date: Moment, altitude: number): boolean {
    return !this.getRiseAltitude(date, altitude) && !this.getSetAltitude(date, altitude)
  }
}
