import moment from 'moment'
import { LastDayStrategy, LastMonthOfYear } from './types'

export class LastDayISO8601Strategy implements LastDayStrategy {
  getLastDayForGregorianLastDay(
    lastDayOfGregorianYear: moment.Moment,
    lastDayOfIsoWeek: number,
  ): moment.Moment {
    if (lastDayOfGregorianYear.month() === LastMonthOfYear.December) {
      // Step 1: Get Jan 4 of the *next* Gregorian year
      const jan4NextYear = moment(`${lastDayOfGregorianYear.year() + 1}-01-04`)

      // Step 2: Go to ISO week 1 of next year,
      // then subtract 1 week to get the *last week* of current ISO year
      const lastIsoWeek = jan4NextYear.isoWeek(1).subtract(1, 'week')

      // Step 3: Move to the desired ISO weekday (default is Sunday = 7)
      return lastIsoWeek.isoWeekday(lastDayOfIsoWeek)
    } else {
      // NEW LOGIC: Only return last occurrence of weekday in this month on or before lastDayOfGregorianYear
      const candidate = lastDayOfGregorianYear
        .clone()
        .isoWeekday(lastDayOfIsoWeek)
      // If candidate is after lastDayOfGregorianYear, go one week back
      if (candidate.isAfter(lastDayOfGregorianYear)) {
        candidate.subtract(7, 'days')
      }
      // Ensure candidate is in the same month
      if (candidate.month() !== lastDayOfGregorianYear.month()) {
        // If it's not, go back one more week
        candidate.subtract(7, 'days')
      }
      return candidate
    }
  }
}
