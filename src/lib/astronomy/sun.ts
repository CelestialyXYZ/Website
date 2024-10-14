import { Observer, SearchRiseSet, Body } from "astronomy-engine"

export class Sun {
  observer: Observer
  constructor(observer: Observer) {
    this.observer = observer
  }
  getRise(date: Date) {
    return SearchRiseSet(Body.Sun, this.observer, +1, new Date(date.setHours(0, 0, 0)), 1)?.date
  }
  getSet(date: Date) {
    return SearchRiseSet(Body.Sun, this.observer, -1, new Date(date.setHours(0, 0, 0)), 1)?.date
  }
}
