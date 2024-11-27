import type { CulminationDateCoords } from "@/declare"
import {
  Observer,
  SearchRiseSet,
  Body,
  Equator,
  Horizon,
  SearchAltitude,
  GeoVector,
  AngleBetween
} from "astronomy-engine"
import type { Moment } from "moment"
import moment from "moment"

export class Sun {
  observer: Observer
  constructor(observer: Observer) {
    this.observer = observer
  }
  /**
   * Calculates the altitude, azimuth, and distance of the Sun for a given date at the observer's location.
   * @param {Moment} date The date at which to calculate the position of the Sun.
   * @returns {{ altitude: number; azimuth: number; dist: number }} An object with the altitude and azimuth of the Sun at the given date, as well as its distance from Earth in kilometers.
   */
  getAltAz(date: Moment): { altitude: number; azimuth: number; dist: number } {
    //setting the right ascension max digits after comma otherwise it causes an infinite number error from astronomy-engine library
    const { dec, ra, dist } = Equator(Body.Sun, date.toDate(), this.observer, true, true)

    const { altitude, azimuth } = Horizon(date.toDate(), this.observer, ra, dec, "normal")

    return { altitude, azimuth, dist }
  }
  /**
   * Calculates the rise time of the Sun for a given date at the observer's location.
   *
   * @param {Moment} date The date at which to calculate the rise time.
   * @returns {Moment} The rise time as a Moment object.
   */
  getRise(date: Moment): Moment {
    return moment(SearchRiseSet(Body.Sun, this.observer, +1, date.startOf("day").toDate(), 1)?.date)
  }
  /**
   * Calculates the set time of the Sun for a given date at the observer's location.
   *
   * @param {Moment} date The date at which to calculate the set time.
   * @returns {Moment} The set time as a Moment object.
   */
  getSet(date: Moment): Moment {
    return moment(SearchRiseSet(Body.Sun, this.observer, -1, date.startOf("day").toDate(), 1)?.date)
  }

  /**
   * Calculates the culmination time of the Sun for a given date at the observer's location.
   *
   * @param {Moment} date - The date at which to calculate the culmination time.
   * @param {number} [step=0.25] - The step size in hours for generating the sky path.
   * @returns {CulminationDateCoords} - An object containing the culmination time as a Moment object,
   *                                    as well as the altitude and azimuth at the culmination point.
   */
  getCulmination(date: Moment, step: number = 0.25): CulminationDateCoords {
    const skyPath = this.getSkyPath(date, step)

    const culmination = skyPath.reduce((maxPos, currentPos) => {
      return currentPos.altitude > maxPos.altitude ? currentPos : maxPos
    }, skyPath[0])

    const { dec, ra } = Equator(Body.Sun, date.toDate(), this.observer, true, true)

    const result: CulminationDateCoords = {
      date: culmination.time,
      coords: {
        ra,
        dec,
        altitude: culmination.altitude,
        azimuth: culmination.azimuth
      }
    }

    return result
  }
  /**
   * Calculates the rise time of the Sun at a given date and altitude above the horizon at the observer's location.
   * @param {Moment} date The date at which to calculate the rise time.
   * @param {number} altitude The altitude above the horizon (in degrees) at which to calculate the rise time.
   * @returns {Moment | null} The rise time as a Moment object, or null if the Sun does not rise above the given altitude on the given date.
   */
  getRiseAltitude(date: Moment, altitude: number): Moment | null {
    const rise = SearchAltitude(
      Body.Sun,
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
   * Calculates the set time of the Sun at a given date and altitude above the horizon at the observer's location.
   * @param {Moment} date The date at which to calculate the set time.
   * @param {number} altitude The altitude above the horizon for which to calculate the set time.
   * @returns {Moment | null} The set time as a Moment object, or null if the Sun does not set at the given altitude.
   */
  getSetAltitude(date: Moment, altitude: number): Moment | null {
    const set = SearchAltitude(
      Body.Sun,
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
  /**
   * Generates an array of objects representing the sky path of the Sun over a 24 hour period. The array will contain `step` number of
   * elements, each representing the position of the Sun in the sky at a given hour of the day.
   *
   * @param {number} step The number of elements in the array, which also
   *                      represents the number of hours in the day at which the
   *                      object's position will be calculated.
   * @returns {{ altitude: number; azimuth: number; time: Moment; hour: number }[]}
   *          An array of objects, each containing the altitude and azimuth of
   *          the Sun at a given hour of the day, as well as the time and hour
   *          of the day.
   */
  getSkyPath(
    date: Moment,
    step: number
  ): { altitude: number; azimuth: number; time: Moment; hour: number }[] {
    const dateOfDay = moment(date).startOf("day").set("hours", 12) // Start from 12 pm on the current day
    const numberOfSteps = Math.floor(24 / step)

    // Generate a time array for calculating positions
    const times: Moment[] = []

    // Add dates from 12 pm to 12 am to time array (first loop)
    for (let i = 0; i <= numberOfSteps; i++) {
      times.push(dateOfDay.clone().add(i * step, "hours"))
    }

    // Store paths in a list
    const path: { altitude: number; azimuth: number; time: Moment; hour: number }[] = []

    times.forEach((time) => {
      const { ra, dec } = Equator(Body.Sun, time.toDate(), this.observer, true, true)

      const { altitude, azimuth } = Horizon(time.toDate(), this.observer, ra, dec, "normal")

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
   * Calculates the angle between the Sun and the Moon for a given date at the observer's location.
   *
   * @param {Moment} date The date at which to calculate the angle.
   * @returns {number} The angle between the Sun and the Moon in degrees.
   */
  getAngleFromMoon(date: Moment): number {
    const moonGeoVector = GeoVector(Body.Moon, date.toDate(), true)
    const sunGeoVector = GeoVector(Body.Sun, date.toDate(), true)

    return AngleBetween(moonGeoVector, sunGeoVector)
  }
}
