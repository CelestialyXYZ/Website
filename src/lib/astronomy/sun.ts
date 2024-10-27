import { Observer, SearchRiseSet, Body, Equator, Horizon, SearchAltitude } from "astronomy-engine"
import type { Moment } from "moment"
import moment from "moment"

export class Sun {
  observer: Observer
  constructor(observer: Observer) {
    this.observer = observer
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
    for (let i = 0; i < numberOfSteps; i++) {
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

    // Add a 24-hour point to complete the graph cycle
    if (path.length > 0) {
      const tempDate = path[0].time.add(1, "day") //generate the last date one day after initial date
      path.push({
        altitude: path[0].altitude,
        azimuth: path[0].azimuth,
        time: path[0].time,
        hour: tempDate.hours() + tempDate.minutes() / 60
      })
    }

    return path
  }
}
