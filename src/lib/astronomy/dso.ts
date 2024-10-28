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

export class Dso {
  dso: DsoObject
  observer: Observer
  constructor(dso: DsoObject, observer: Observer) {
    this.dso = dso
    this.observer = observer
  }
  /**
   * Returns the URL of an image of the DSO, either from the Messier, NGC or IC catalogs.
   * @param res The resolution of the image, either 1920x1080, 1280x900 or 500x300.
   * @returns The URL of the image, or an empty string if the DSO is not in any of the catalogs.
   */
  getImg(res: "1920x1280" | "1280x900" | "500x300"): string {
    let type = ""
    let name = ""
    if (this.dso.messier) {
      type = "messier"
      name = this.dso.messier[0].replace("M", "")
    } else if (this.dso.new_general_catalog) {
      type = "ngc"
      name = this.dso.new_general_catalog[0].replace("NGC", "")
    } else if (this.dso.index_catalog) {
      type = "ic"
      name = this.dso.index_catalog[0].replace("IC", "")
    } else {
      return ""
    }

    return `https://cdn.statically.io/gh/CelestialyXYZ/Files/main/images/${type}/${res}/${type}_${name}.jpg`
  }
  /**
   * Returns the main identifier of the deep sky object.
   * @returns {string} The main identifier of the deep sky object.
   */
  getMainIdentifier(): string {
    if (this.dso.messier && this.dso.messier.length > 0) {
      return this.dso.messier[0]
    } else if (this.dso.new_general_catalog && this.dso.new_general_catalog.length > 0) {
      return this.dso.new_general_catalog[0]
    } else if (this.dso.index_catalog && this.dso.index_catalog.length > 0) {
      return this.dso.index_catalog[0]
    } else if (this.dso.identifiers && this.dso.identifiers.length > 0) {
      return this.dso.identifiers[0]
    } else {
      return "" // return an empty string if no identifier is found
    }
  }
  /**
   * Returns an array of all identifiers for the deep sky object.
   * This includes the object's name in French and English, any extra names, Messier, New General Catalog, Index Catalog, and any other identifiers.
   * @returns {string[]} An array of all identifiers for the deep sky object.
   */
  getIdentifiers(): string[] {
    let result: string[] = []

    result = result.concat(this.dso.name_fr || [])
    result = result.concat(this.dso.name_en || [])
    result = result.concat(this.dso.name_extra || [])
    result = result.concat(this.dso.messier || [])
    result = result.concat(this.dso.new_general_catalog || [])
    result = result.concat(this.dso.index_catalog || [])
    result = result.concat(this.dso.identifiers || [])

    return result
  }
  /**
   * Returns the name of the deep sky object in French, English, or its first extra name.
   * If returnMainIdentifier is true (default), it returns the main identifier of the object if no name is found.
   * @param {boolean} [returnMainIdentifier=true] Whether to return the main identifier if no name is found.
   * @returns {string|null} The name of the deep sky object, or its main identifier if no name is found, or null if no identifier is found.
   */
  getName(returnMainIdentifier: boolean = true): string {
    if (this.dso.name_fr && this.dso.name_fr.trim() !== "") {
      return this.dso.name_fr
    } else if (this.dso.name_en && this.dso.name_en.trim() !== "") {
      return this.dso.name_en
    } else if (this.dso.name_extra && this.dso.name_extra.length > 0) {
      return this.dso.name_extra[0] // Take the first entry in the name_extra array
    }
    if (returnMainIdentifier) {
      return this.getMainIdentifier()
    }
    return ""
  }
  /**
   * Calculates the altitude and azimuth of the deep sky object for a given date at the observer's location.
   * @param {Date} date The date at which to calculate the position of the object.
   * @returns {{ altitude: number, azimuth: number }} An object with the altitude and azimuth of the object at the given date.
   */
  getAltAz(date: Moment): { altitude: number; azimuth: number } {
    //setting the right ascension max digits after comma otherwise it causes an infinite number error from astronomy-engine library
    const rightAscension = this.dso.right_ascension
      ? parseFloat(parseFloat(this.dso.right_ascension).toFixed(6))
      : 0
    const declination = this.dso.declination
      ? parseFloat(parseFloat(this.dso.declination).toFixed(6))
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
    return raToHMS(this.dso.right_ascension || 0)
  }
  /**
   * Converts the declination of the deep sky object to a string formatted
   * in degrees, minutes, and seconds.
   *
   * @returns {string} The declination as a string in the format "+/-dd mm ss".
   */
  getDecHMS(): string {
    return decToDMS(this.dso.declination || 0)
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

    // Setting the right ascension and declination, with a fixed decimal precision to avoid infinite values
    const rightAscension = this.dso.right_ascension
      ? parseFloat(parseFloat(this.dso.right_ascension).toFixed(6))
      : 0
    const declination = this.dso.declination
      ? parseFloat(parseFloat(this.dso.declination).toFixed(6))
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
    const rightAscension = this.dso.right_ascension
      ? parseFloat(parseFloat(this.dso.right_ascension).toFixed(6))
      : 0
    const declination = this.dso.declination
      ? parseFloat(parseFloat(this.dso.declination).toFixed(6))
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
    const rightAscension = this.dso.right_ascension
      ? parseFloat(parseFloat(this.dso.right_ascension).toFixed(6))
      : 0
    const declination = this.dso.declination
      ? parseFloat(parseFloat(this.dso.declination).toFixed(6))
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
    const rightAscension = this.dso.right_ascension
      ? parseFloat(parseFloat(this.dso.right_ascension).toFixed(6))
      : 0
    const declination = this.dso.declination
      ? parseFloat(parseFloat(this.dso.declination).toFixed(6))
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
   * Calculates the rise time of the object at a given date and altitude above the horizon at the observer's location.
   * @param {Moment} date The date at which to calculate the rise time.
   * @param {number} altitude The altitude above the horizon (in degrees) at which to calculate the rise time.
   * @returns {Moment | null} The rise time as a Moment object, or null if the object does not rise above the given altitude on the given date.
   */
  getRiseAltitude(date: Moment, altitude: number): Moment | null {
    //setting the right ascension max digits after comma otherwise it causes an infinite number error from astronomy-engine library
    const rightAscension = this.dso.right_ascension
      ? parseFloat(parseFloat(this.dso.right_ascension).toFixed(6))
      : 0
    const declination = this.dso.declination
      ? parseFloat(parseFloat(this.dso.declination).toFixed(6))
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
    const rightAscension = this.dso.right_ascension
      ? parseFloat(parseFloat(this.dso.right_ascension).toFixed(6))
      : 0
    const declination = this.dso.declination
      ? parseFloat(parseFloat(this.dso.declination).toFixed(6))
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
