import {
  Observer,
  Horizon,
  Body,
  Equator,
  SearchRiseSet,
  SearchAltitude,
  AngleBetween,
  GeoVector,
  KM_PER_AU,
  MoonPhase,
  Illumination
} from "astronomy-engine"
import { raToHMS, decToDMS } from "./utils"
import moment, { type Moment } from "moment"
import type { CulminationDateCoords, SkyPathCoords } from "@/declare"

export class Moon {
  observer: Observer
  readonly MoonCycleDays: number = 29.530588853
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
  getSkyPath(date: Moment, step: number): SkyPathCoords {
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
      const { ra, dec } = Equator(Body.Moon, time.toDate(), this.observer, true, true)

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
   * Calculates the culmination time of the Moon for a given date at the observer's location.
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

    const { dec, ra } = Equator(Body.Moon, date.toDate(), this.observer, true, true)

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
   * Calculates the angle between the Moon and the Moon for a given date at the observer's location.
   *
   * @param {Moment} date The date at which to calculate the angle.
   * @returns {number} The angle between the Sun and the Moon in degrees.
   */
  getAngleFromMoon(date: Moment): number {
    const moonGeoVector = GeoVector(Body.Moon, date.toDate(), true)

    return AngleBetween(moonGeoVector, moonGeoVector)
  }
  /**
   * Calculates the distance of the Moon from the observer for a given date at the observer's location.
   *
   * @param {Moment} date The date at which to calculate the distance.
   * @returns {EquatorialCoordinates} An object with the distance from Earth in kilometers.
   */
  getDistance(date: Moment): number {
    return Equator(Body.Moon, date.toDate(), this.observer, true, true).dist * KM_PER_AU
  }
  /**
   * Calculates the age of the Moon, in days, for a given date.
   * The age of the Moon is the time elapsed since the last new moon.
   *
   * @param {Moment} date The date at which to calculate the age of the Moon.
   * @returns {number} The age of the Moon in days.
   */
  getAge(date: Moment): number {
    return (MoonPhase(date.toDate()) / 360) * this.MoonCycleDays
  }
  /**
   * Calculates the illumination of the Moon, given as the magnitude, phase angle and phase fraction.
   *
   * @param {Moment} date The date at which to calculate the illumination.
   * @returns {{ mag: number, phase_angle: number, phase_fraction: number }}
   *          An object with the magnitude, phase angle (in degrees) and phase fraction.
   */
  getIllumination(date: Moment): { mag: number; phase_angle: number; phase_fraction: number } {
    const { mag, phase_angle, phase_fraction } = Illumination(Body.Moon, date.toDate())
    return {
      mag,
      phase_angle,
      phase_fraction
    }
  }
  getImg(date: Moment): string {
    const frameNumber = (Math.abs(Math.round(this.getAge(date)) * 8) % 238) + 1
    return `https://cdn.statically.io/gh/CelestialyXYZ/Astronomy-images/main/images/moon/moon_${frameNumber}.jpg`
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
   * Generates a calendar for the month of the given date, including information about each day.
   *
   * The calendar is structured into weeks, each containing multiple days. Each day includes
   * details such as the day of the month, whether it belongs to the current month, the date
   * object, illumination data, and an image URL.
   *
   * @param {Moment} date - The date for which to generate the calendar.
   * @returns {Array<{week: number, days: Array<{day: number, dayOfMonth: boolean, date: Moment, illumination: {mag: number, phase_angle: number, phase_fraction: number}, img: string}>}>}
   *          An array of weeks, each containing day details for the month of the provided date.
   */
  getCalendar(date: Moment): Array<{
    week: number
    days: Array<{
      day: number
      dayOfMonth: boolean
      date: Moment
      illumination: { mag: number; phase_angle: number; phase_fraction: number }
      img: string
    }>
  }> {
    const startOfMonth = date.clone().startOf("month")
    const endOfMonth = date.clone().endOf("month")
    const daysOfMonth = startOfMonth.daysInMonth()
    const weeks: Array<{
      week: number
      days: Array<{
        day: number
        dayOfMonth: boolean
        date: Moment
        illumination: { mag: number; phase_angle: number; phase_fraction: number }
        img: string
      }>
    }> = []

    // Add days from the previous month to fill the first week
    const startOfWeek = startOfMonth.clone().startOf("isoWeek")
    for (let d = startOfWeek; d.isBefore(startOfMonth); d.add(1, "days")) {
      const dayInfos = {
        day: d.date(),
        dayOfMonth: false,
        date: d.clone(),
        illumination: this.getIllumination(d),
        img: this.getImg(d)
      }
      const weekIndex = weeks.findIndex((week) => week.week === d.isoWeek())
      if (weekIndex === -1) {
        weeks.push({ week: d.isoWeek(), days: [dayInfos] })
      } else {
        weeks[weekIndex].days.push(dayInfos)
      }
    }

    // Add days of the current month
    for (let i = 0; i < daysOfMonth; i++) {
      const currentDay = startOfMonth.clone().add(i, "days")
      const currentDayWeekYear = currentDay.isoWeek()

      const dayInfos = {
        day: i + 1,
        dayOfMonth: true,
        date: currentDay,
        illumination: this.getIllumination(currentDay),
        img: this.getImg(currentDay)
      }

      const weekIndex = weeks.findIndex((week) => week.week === currentDayWeekYear)
      if (weekIndex === -1) {
        weeks.push({ week: currentDayWeekYear, days: [dayInfos] })
      } else {
        weeks[weekIndex].days.push(dayInfos)
      }
    }

    // Add days from the next month to fill the last week
    const endOfWeek = endOfMonth.clone().endOf("isoWeek")
    for (let d = endOfMonth.clone().add(1, "days"); d.isSameOrBefore(endOfWeek); d.add(1, "days")) {
      const dayInfos = {
        day: d.date(),
        dayOfMonth: false,
        date: d.clone(),
        illumination: this.getIllumination(d),
        img: this.getImg(d)
      }
      const weekIndex = weeks.findIndex((week) => week.week === d.isoWeek())
      if (weekIndex === -1) {
        weeks.push({ week: d.isoWeek(), days: [dayInfos] })
      } else {
        weeks[weekIndex].days.push(dayInfos)
      }
    }

    return weeks
  }
}
