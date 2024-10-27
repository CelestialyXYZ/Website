import { Observer, SearchRiseSet, Body } from "astronomy-engine"
import type { Moment } from "moment"
import moment from "moment"

export class Sun {
  observer: Observer
  constructor(observer: Observer) {
    this.observer = observer
  }
  getRise(date: Moment): Moment {
    return moment(SearchRiseSet(Body.Sun, this.observer, +1, date.startOf("day").toDate(), 1)?.date)
  }
  getSet(date: Moment): Moment {
    return moment(SearchRiseSet(Body.Sun, this.observer, -1, date.startOf("day").toDate(), 1)?.date)
  }
}
