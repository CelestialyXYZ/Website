import { Observer, Horizon, Body, Equator, SearchRiseSet, SearchAltitude } from "astronomy-engine"
import { raToHMS, decToDMS } from "./utils"
import moment, { type Moment } from "moment"

export class Moon {
  observer: Observer
  /**
   * Creates a new Moon object with the given observer.
   * @param {Observer} observer The observer from which to calculate the position of the Moon.
   */
  constructor(observer: Observer) {
    this.observer = observer
  }
  /**
   * Calculates the altitude, azimuth, and distance of the Moon for a given date at the observer's location.
   * @param {Moment} date The date at which to calculate the position of the Moon.
   * @returns {{ altitude: number; azimuth: number; dist: number }} An object with the altitude and azimuth of the Moon at the given date, as well as its distance from Earth in kilometers.
   */
  getAltAz(date: Moment): { altitude: number; azimuth: number; dist: number } {
    //setting the right ascension max digits after comma otherwise it causes an infinite number error from astronomy-engine library
    const { dec, ra, dist } = Equator(Body.Moon, date.toDate(), this.observer, true, true)

    const { altitude, azimuth } = Horizon(date.toDate(), this.observer, ra, dec, "normal")

    return { altitude, azimuth, dist }
  }
  /**
   * Converts the right ascension of the Moon to a string formatted
   * in hours, minutes, and seconds.
   *
   * @param {Moment} date The date at which to calculate the Moon's position.
   * @returns {string} The right ascension as a string in the format "h mm ss".
   */
  getRaHMS(date: Moment): string {
    const { ra } = Equator(Body.Moon, date.toDate(), this.observer, true, true)
    return raToHMS(ra || 0)
  }
  /**
   * Converts the declination of the deep sky object to a string formatted
   * in degrees, minutes, and seconds.
   *
   * @returns {string} The declination as a string in the format "+/-dd mm ss".
   */
  getDecHMS(date: Moment): string {
    const { dec } = Equator(Body.Moon, date.toDate(), this.observer, true, true)
    return decToDMS(dec || 0)
  }
  /**
   * Generates an array of objects representing the sky path of the Moon over a 24 hour period. The array will contain `step` number of
   * elements, each representing the position of the Moon in the sky at a given hour of the day.
   *
   * @param {number} step The number of elements in the array, which also
   *                      represents the number of hours in the day at which the
   *                      object's position will be calculated.
   * @returns {{ altitude: number; azimuth: number; time: Moment; hour: number }[]}
   *          An array of objects, each containing the altitude and azimuth of
   *          the Moon at a given hour of the day, as well as the time and hour
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
      const { ra, dec } = Equator(Body.Moon, time.toDate(), this.observer, true, true)

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
  /**
   * Calculates the rise time of the Moon for a given date at the observer's location.
   *
   * @param {Moment} date - The date at which to calculate the rise time.
   * @returns {Moment} - The rise time as a Moment object.
   */
  getRise(date: Moment): Moment {
    return moment(
      SearchRiseSet(Body.Moon, this.observer, +1, date.startOf("day").toDate(), 1)?.date
    )
  }
  /**
   * Calculates the set time of the Moon for a given date at the observer's location.
   *
   * @param {Moment} date - The date at which to calculate the set time.
   * @returns {Moment} - The set time as a Moment object.
   */
  getSet(date: Moment): Moment {
    return moment(
      SearchRiseSet(Body.Moon, this.observer, -1, date.startOf("day").toDate(), 1)?.date
    )
  }
  /**
   * Calculates the rise time of the Moon for a given date at the observer's location when the Moon will be at a certain altitude above the horizon.
   *
   * @param {Moment} date - The date at which to calculate the rise time.
   * @param {number} altitude - The altitude above the horizon at which to calculate the rise time.
   * @returns {Moment | null} - The rise time as a Moment object, or null if the Moon does not rise at the specified altitude.
   */
  getRiseAltitude(date: Moment, altitude: number): Moment | null {
    const rise = SearchAltitude(
      Body.Moon,
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
  getSetAltitude(date: Moment, altitude: number): Moment | null {
    const set = SearchAltitude(
      Body.Moon,
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
}
