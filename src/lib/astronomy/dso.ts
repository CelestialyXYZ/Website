import { Observer, Horizon } from "astronomy-engine"
import { raToHMS, decToDMS } from "./utils"

export class Dso {
  dso: DsoObject
  observer: Observer
  constructor(dso: DsoObject, observer: Observer) {
    this.dso = dso
    this.observer = observer
  }
  /**
   * Returns the URL of the image of the deep sky object.
   * @param {String} res - The resolution of the image. Can be "1920x1280" or "1280x960".
   * @returns {string} The URL of the image.
   */
  getImg(res: String): string {
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
  getAltAz(date: Date): { altitude: number; azimuth: number } {
    //setting the right ascension max digits after comma otherwise it causes an infinite number error from astronomy-engine library
    const rightAscension = this.dso.right_ascension
      ? parseFloat(parseFloat(this.dso.right_ascension).toFixed(6))
      : 0
    const declination = this.dso.declination
      ? parseFloat(parseFloat(this.dso.declination).toFixed(6))
      : 0

    const { altitude, azimuth } = Horizon(
      date,
      this.observer,
      rightAscension,
      declination,
      "normal"
    )

    return { altitude, azimuth }
  }
  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Converts the right ascension of the deep sky object to a string formatted
   * in hours, minutes, and seconds.
   *
   * @returns {string} The right ascension as a string in the format "h mm ss".
   */
  /******  5df88355-3d31-4b92-a703-84c2b604ca40  *******/
  getRaHMS(): string {
    return raToHMS(this.dso.right_ascension || 0)
  }
  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Converts the declination of the deep sky object to a string formatted
   * in degrees, minutes, and seconds.
   *
   * @returns {string} The declination as a string in the format "+/-dd mm ss".
   */
  /******  f1cacf84-68a8-4629-8f4a-c7b75d9c773d  *******/
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
  getSkyPath(step: number): { altitude: number; azimuth: number; time: Date; hour: number }[] {
    const dateOfDay = new Date().setHours(0, 0, 0)
    const dateOfDayMid = new Date().setHours(12, 0, 0)
    const numberOfSteps = Math.floor(12 / step)
    const millisInAnHour = 60 * 60 * 1000

    //setting the right ascension max digits after comma otherwise it causes an infinite number error from astronomy-engine library
    const rightAscension = this.dso.right_ascension
      ? parseFloat(parseFloat(this.dso.right_ascension).toFixed(6))
      : 0
    const declination = this.dso.declination
      ? parseFloat(parseFloat(this.dso.declination).toFixed(6))
      : 0

    //Generate a time of array from which the position will be calculated
    const times: Date[] = []

    //Add dates from 12am to 12pm
    for (let i = 0; i < numberOfSteps; i++) {
      times.push(new Date(dateOfDayMid + step * millisInAnHour * i))
    }

    //Add dates from 12pm to 12am
    for (let i = 0; i < numberOfSteps; i++) {
      times.push(new Date(dateOfDay + step * millisInAnHour * i))
    }

    //Storing paths in a list
    const path: { altitude: number; azimuth: number; time: Date; hour: number }[] = []

    times.forEach((time) => {
      const { altitude, azimuth } = Horizon(
        time,
        this.observer,
        rightAscension,
        declination,
        "normal"
      )

      path.push({
        altitude,
        azimuth,
        time,
        hour: time.getHours() + time.getMinutes() / 60
      })
    })

    //Add a 24h point for the graph to be finished
    if (path.length > 0) {
      path.push({
        altitude: path[0].altitude,
        azimuth: path[0].azimuth,
        time: path[0].time,
        hour: 12
      })
    }

    return path
  }
}
