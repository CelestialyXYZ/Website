import { ref } from "vue"

import { useSessionStore } from "@/stores/session"
import { Sun } from "@/lib/astronomy/sun"
import { Moon } from "@/lib/astronomy/moon"
import { Dso } from "@/lib/astronomy/dso"
import { azimuthToDirection } from "./utils"

import moment, { type Moment } from "moment"

const session = useSessionStore()

export class SkyPath {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  width: number
  sun: Sun
  moon: Moon
  stepSize: number
  height: number
  date: Date
  object: Dso
  skyPath: { altitude: number; azimuth: number; time: Moment; hour: number }[]
  maxAltitudePosition: { altitude: number; azimuth: number; time: Moment; hour: number }
  label: any = ref({
    hourPercentage: 0,
    altitudePercentage: 0,
    hour: 0,
    coords: {
      altitude: 0,
      azimuth: 0
    },
    text: ""
  })

  //Settings
  readonly dayColor = "#0369a1"
  readonly duskColor = "#d97706"
  readonly nightColor = "#111111"
  readonly offsetHour = 1 //1 hour

  constructor(canvasId: string, object: Dso, stepSize: number) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement
    this.date = new Date()
    this.skyPath = object.getSkyPath(moment(), stepSize)
    this.maxAltitudePosition = this.skyPath.reduce((maxPos, currentPos) => {
      return currentPos.altitude > maxPos.altitude ? currentPos : maxPos
    }, this.skyPath[0])
    this.moon = new Moon(session.getObserver())
    this.sun = new Sun(session.getObserver())
    this.object = object
    this.stepSize = stepSize

    if (this.canvas) {
      this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D
      this.width = this.canvas.width
      this.height = this.canvas.height

      this.draw()

      this.setLabelAtTransit()

      //recenter pointer at transit point when the mouse is leaving the chart
      this.canvas.addEventListener("mouseout", () => {
        this.setLabelAtTransit()
      })

      this.canvas.addEventListener("mousemove", (e) => {
        const { width } = this.canvas.getBoundingClientRect()

        const absolutePositionInHours = (e.offsetX / width) * 24

        const currentPosistionDate = moment()
          .startOf("day")
          .set("hours", 12)
          .add(Math.floor(absolutePositionInHours), "hours")
          .add(
            Math.floor((absolutePositionInHours - Math.floor(absolutePositionInHours)) * 60),
            "minutes"
          )

        const { altitude, azimuth } = this.object.getAltAz(currentPosistionDate)

        this.label.value.coords = {
          altitude,
          azimuth
        }

        this.label.value = {
          hourPercentage: Math.abs((e.offsetX / width) * 100),
          altitudePercentage: (altitude / 90) * 100,
          hour: Math.abs(this.convertPixelsToHours(e.offsetX, width)),
          coords: {
            altitude,
            azimuth
          },
          text: `Alt: ${Math.floor(altitude)}° - Az: ${Math.floor(azimuth)}° (${azimuthToDirection(azimuth)}) - ${currentPosistionDate.format("HH:mm")} - ${Math.round(this.object.getAngleFromMoon(currentPosistionDate))}° de la Lune`
        }
      })
    } else {
      throw new Error("Canvas element not found: " + canvasId)
    }
  }

  draw(): void {
    // Set the actual canvas size to match the display size
    const dpr = window.devicePixelRatio || 1
    this.canvas.width = this.width * dpr
    this.canvas.height = this.height * dpr
    if (this.ctx) {
      this.ctx.scale(dpr, dpr) // Scale canvas for high-DPI screens
      this.ctx.clearRect(0, 0, this.width, this.height) // Clear the canvas

      this.drawBg()

      this.drawLines(30)

      //debugging logs
      console.log(`Canvas width: ${this.width}px, height: ${this.height}px`)
    }
  }

  drawBg(): void {
    const hourInPx = this.width / 24

    // Mock sunrise and sunset times (replace with actual Sun class)
    const sunRise = this.sun.getRise(moment()) || moment()
    const sunSet = this.sun.getSet(moment()) || moment()

    // Convert times to decimal hours
    const sunRiseHours = sunRise.hours() + sunRise.minutes() / 60
    const sunSetHours = sunSet.hours() + sunSet.minutes() / 60

    // Convert hours to x-coordinate pixels
    const sunriseHoursPx = this.convertHoursToPixels(sunRiseHours, "width")
    const sunsetHoursPx = this.convertHoursToPixels(sunSetHours, "width")

    //Set the color to skyColor
    this.ctx.fillStyle = this.dayColor
    //Draw the day section before sunset (left part)
    this.ctx.fillRect(0, 0, sunsetHoursPx - hourInPx * this.offsetHour + 3, this.height) //add 3px offset
    //Draw the day section after sunset (right part)
    this.ctx.fillRect(
      sunriseHoursPx + hourInPx * this.offsetHour - 3,
      0,
      this.width - sunriseHoursPx,
      this.height
    ) //add 3px offset

    //Draw the night section
    this.ctx.fillStyle = this.nightColor
    this.ctx.fillRect(
      sunsetHoursPx,
      0,
      sunriseHoursPx - sunsetHoursPx - hourInPx * this.offsetHour,
      this.height
    )

    //First left gradient from day to dusk
    //Register gradient
    const gradDayToDusk = this.ctx.createLinearGradient(
      sunsetHoursPx - hourInPx * this.offsetHour,
      0,
      sunsetHoursPx,
      0
    )
    gradDayToDusk.addColorStop(0, this.dayColor)
    gradDayToDusk.addColorStop(1, this.duskColor)
    //Draw gradient
    this.ctx.fillStyle = gradDayToDusk
    this.ctx.fillRect(
      sunsetHoursPx - hourInPx * this.offsetHour,
      0,
      hourInPx * this.offsetHour,
      this.height
    )

    //Second left gradient from dusk to night
    //Register gradient
    const gradDuskToNight = this.ctx.createLinearGradient(
      sunsetHoursPx - 1, //add 1px offset to fix black line issue
      0,
      sunsetHoursPx + hourInPx * this.offsetHour,
      0
    )
    gradDuskToNight.addColorStop(0, this.duskColor)
    gradDuskToNight.addColorStop(1, this.nightColor)
    //Draw gradient
    this.ctx.fillStyle = gradDuskToNight
    this.ctx.fillRect(sunsetHoursPx - 1, 0, hourInPx * this.offsetHour, this.height) //add 1px offset to fix black line issue

    //First right gradient from night to dusk
    //Register gradient
    const gradNightToDusk = this.ctx.createLinearGradient(
      sunriseHoursPx - hourInPx * this.offsetHour,
      0,
      sunriseHoursPx,
      0
    )
    gradNightToDusk.addColorStop(0, this.nightColor)
    gradNightToDusk.addColorStop(1, this.duskColor)
    //Draw gradient
    this.ctx.fillStyle = gradNightToDusk
    this.ctx.fillRect(
      sunriseHoursPx - hourInPx * this.offsetHour,
      0,
      hourInPx * this.offsetHour,
      this.height
    )

    //Second right gradient from dusk to day
    //Register gradient
    const gradDuskToDay = this.ctx.createLinearGradient(
      sunriseHoursPx - 1, //add 1px offset
      0,
      sunriseHoursPx + hourInPx * this.offsetHour,
      0
    )
    gradDuskToDay.addColorStop(0, this.duskColor)
    gradDuskToDay.addColorStop(1, this.dayColor)
    //Draw gradient
    this.ctx.fillStyle = gradDuskToDay
    this.ctx.fillRect(sunriseHoursPx - 1, 0, hourInPx * this.offsetHour, this.height) //add 1px offset

    // Debugging logs
    console.log(`Sunrise at: ${sunRiseHours} hours (${sunriseHoursPx}px)`)
    console.log(`Sunset at: ${sunSetHours} hours (${sunsetHoursPx}px)`)
  }

  drawLines(minAltitude: number) {
    if (minAltitude < 0 || minAltitude > 90) {
      throw new Error("Mininmum altitude must be between 0 and 90")
    }

    //Draw middle chart line
    this.ctx.strokeStyle = "#52525b"
    this.ctx.lineWidth = 4
    //Set the style to a dashed line
    this.ctx.setLineDash([20, 10])

    this.ctx.beginPath()
    this.ctx.moveTo(this.width / 2, 0)
    this.ctx.lineTo(this.width / 2, this.height)
    this.ctx.stroke()

    //Draw minimum altitude line
    this.ctx.strokeStyle = "#22c55e"

    this.ctx.beginPath()
    this.ctx.moveTo(0, this.height - (minAltitude / 90) * this.height)
    this.ctx.lineTo(this.width, this.height - (minAltitude / 90) * this.height)
    this.ctx.stroke()

    //Draw the moon path
    this.ctx.strokeStyle = "#d4d4d4"
    this.ctx.lineWidth = 7
    //Reset dashed line style
    this.ctx.setLineDash([])

    this.ctx.beginPath()
    this.moon.getSkyPath(moment(), this.stepSize).forEach((data, i) => {
      if (i == 0) {
        this.ctx.moveTo(0, this.height - (data.altitude / 90) * this.height)
      } else {
        this.ctx.lineTo(
          this.convertHoursToPixels(data.hour, "width"),
          this.height - (data.altitude / 90) * this.height
        )
      }
      //console.log(`x: ${convertHoursToPixels(data.hour, this.width)}, y: ${this.height - (data.altitude / 90) * this.height}, hour: ${data.hour}, altitude: ${data.altitude}, date: ${data.time}`)
    })
    this.ctx.stroke()

    //Draw path of the object line
    this.ctx.strokeStyle = "#dc2626"

    this.ctx.beginPath()
    this.skyPath.forEach((data, i) => {
      if (i == 0) {
        this.ctx.moveTo(0, this.height - (data.altitude / 90) * this.height)
      } else {
        this.ctx.lineTo(
          this.convertHoursToPixels(data.hour, "width"),
          this.height - (data.altitude / 90) * this.height
        )
      }
      //console.log(`x: ${convertHoursToPixels(data.hour, this.width)}, y: ${this.height - (data.altitude / 90) * this.height}, hour: ${data.hour}, altitude: ${data.altitude}, date: ${data.time}`)
    })
    this.ctx.stroke()
  }

  setLabelAtTransit(): void {
    this.label.value = {
      hourPercentage: Math.abs(
        (this.convertHoursToPixels(this.maxAltitudePosition.hour, "width") / this.width) * 100
      ),
      altitudePercentage: (this.maxAltitudePosition.altitude / 90) * 100,
      hour: this.maxAltitudePosition.hour,
      coords: {
        altitude: this.maxAltitudePosition.altitude,
        azimuth: this.maxAltitudePosition.azimuth
      },
      text: `Alt: ${Math.floor(this.maxAltitudePosition.altitude)}° - Az: ${Math.floor(this.maxAltitudePosition.azimuth)}° (${azimuthToDirection(this.maxAltitudePosition.azimuth)}) - ${this.maxAltitudePosition.time.format("HH:mm")} - ${Math.round(this.object.getAngleFromMoon(this.maxAltitudePosition.time))}° de la Lune`
    }
  }

  download(format: string, title: string): void {
    const downloadLink = document.createElement("a")
    downloadLink.setAttribute("download", title)
    const dataURL = this.canvas.toDataURL(format)
    const url = dataURL.replace(/^data:image\/png/, "data:application/octet-stream")
    downloadLink.setAttribute("href", url)
    downloadLink.click()
  }

  convertHoursToPixels(hours: number, direction: "width" | "height"): number {
    const maxPixels = direction === "width" ? this.width : this.height
    const halfMaxPixels = maxPixels / 2

    if (hours >= 0 && hours <= 12) {
      return halfMaxPixels + (hours / 12) * halfMaxPixels
    } else if (hours > 12 && hours <= 24) {
      return ((hours - 12) / 12) * halfMaxPixels
    } else {
      return -1 // Return -1 for invalid hours
    }
  }
  convertPixelsToHours(position: number, maxPixels: number): number {
    const halfMaxPixels = maxPixels / 2

    if (position < halfMaxPixels) {
      return (position / halfMaxPixels) * 12 + 12
    } else {
      return ((position - halfMaxPixels) / halfMaxPixels) * 12
    }
  }
}
