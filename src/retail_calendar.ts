import moment from 'moment'
import {
  LastDayStrategy,
  LastMonthOfYear,
  LeapYearStrategy,
  RetailCalendar,
  RetailCalendarConstructor,
  RetailCalendarMonth,
  RetailCalendarOptions,
  RetailCalendarWeek,
  WeekCalculation,
  WeekGrouping,
} from './types'

import { CalendarMonth } from './calendar_month'
import { CalendarWeek } from './calendar_week'
import { LastDayBeforeEOMStrategy } from './last_day_before_eom'
import { LastDayISO8601Strategy } from './last_day_iso_8601_calendar'
import { LastDayNearestEOMStrategy } from './last_day_nearest_eom'
import { FirstBOWOfFirstMonth } from './first_bow_of_first_month'
import { LastDayBeforeEOMExceptLeapYearStrategy } from './last_day_before_eom_except_leap_year'

export const RetailCalendarFactory: RetailCalendarConstructor = class Calendar
  implements RetailCalendar {
  year: number
  calendarYear: number
  numberOfWeeks: number
  months: RetailCalendarMonth[]
  weeks: RetailCalendarWeek[]
  options: RetailCalendarOptions
  lastDayOfYear: moment.Moment
  firstDayOfYear: moment.Moment
  leapYearStrategy: LeapYearStrategy
  weekDistribution: number[]

  constructor(calendarOptions: RetailCalendarOptions, year: number) {
    this.year = year
    this.weekDistribution = calendarOptions.weekDistribution || []
    this.options = calendarOptions
    this.calendarYear = this.getAdjustedGregorianYear(year)
    this.leapYearStrategy = this.getLeapYearStrategy()
    this.numberOfWeeks = this.calculateNumberOfWeeks()
    this.lastDayOfYear = this.calculateLastDayOfYear(this.calendarYear)
    this.firstDayOfYear = moment(this.lastDayOfYear)
      .subtract(this.numberOfWeeks, 'week')
      .add(1, 'day')
      .startOf('day')
    this.weeks = this.generateWeeks()
    this.months = this.generateMonths()
  }

  getLeapYearStrategy() {
    if (
      this.options.restated === undefined &&
      this.options.leapYearStrategy === undefined
    ) {
      throw new Error(
        'One of leapYearStrategy or restated options are required',
      )
    }

    if (this.options.restated !== undefined) {
      // tslint:disable-next-line:no-console
      console.warn(
        'restated option is deprecated. Please use leapYearStrategy instead',
      )
    }

    if (
      this.options.restated !== undefined &&
      this.options.leapYearStrategy !== undefined
    ) {
      throw new Error(
        'Only one of leapYearStrategy or restated options can be given',
      )
    }

    if (this.options.restated !== undefined && this.options.restated === true) {
      return LeapYearStrategy.Restated
    }

    if (this.options.leapYearStrategy !== undefined) {
      return this.options.leapYearStrategy
    }

    return LeapYearStrategy.DropLastWeek
  }

  generateMonths(): RetailCalendarMonth[] {
    const months = []
    const beginningIndex = this.getBeginningOfMonthIndex()
    let index = beginningIndex

    for (const numberOfWeeks of this.getWeekDistribution()) {
      const quarterOfYear = Math.min(
        Math.floor((index - beginningIndex) / 3) + 1,
        4,
      )
      const weeksOfMonth = this.weeks.filter(
        (week) => week.monthOfYear === index,
      )
      const monthStart = moment(weeksOfMonth[0].gregorianStartDate)
      const monthEnd = moment(
        weeksOfMonth[weeksOfMonth.length - 1].gregorianEndDate,
      )
      months.push(
        new CalendarMonth(
          index,
          quarterOfYear,
          numberOfWeeks,
          weeksOfMonth,
          monthStart.toDate(),
          monthEnd.toDate(),
        ),
      )
      index += 1
    }

    return months
  }

  generateWeeks(): RetailCalendarWeek[] {
    const weeks = []
    for (let index = 0; index < this.numberOfWeeks; index++) {
      const weekIndex = this.getWeekIndex(index)
      const [
        monthOfYear,
        weekOfMonth,
        weekOfQuarter,
        quarterOfYear,
      ] = this.getMonthAndWeekOfMonthOfWeek(weekIndex)
      const start = moment(this.firstDayOfYear).add(index, 'week')
      const end = moment(start).add(1, 'week').subtract(1, 'day').endOf('day')
      weeks.push(
        new CalendarWeek(
          weekIndex,
          weekOfMonth,
          weekOfQuarter,
          monthOfYear,
          quarterOfYear,
          start.toDate(),
          end.toDate(),
        ),
      )
    }
    return weeks
  }

  getMonthAndWeekOfMonthOfWeek(
    weekIndex: number,
  ): [number, number, number, number] {
    const weekDistribution = this.getWeekDistribution()
    const monthOffset = this.getBeginningOfMonthIndex()

    let weeksInQuarter = 0
    let weekCount = 0
    let monthOfYear = 0

    for (
      let monthIndex = 0;
      monthIndex < weekDistribution.length;
      monthIndex++
    ) {
      const weeksInMonth = weekDistribution[monthIndex]

      if (monthIndex % 3 === 0)
        weeksInQuarter = weekDistribution
          .slice(monthIndex, monthIndex + 3)
          .reduce((a, b) => a + b, 0)

      if (monthIndex === 13) weeksInQuarter += weekDistribution[monthIndex]

      monthOfYear = monthIndex + monthOffset

      for (let weekInMonth = 0; weekInMonth < weeksInMonth; weekInMonth++) {
        if (weekIndex === weekCount) {
          const weekInQuarter = weekIndex % weeksInQuarter
          const quarterOfYear = monthIndex % 3
          return [monthOfYear, weekInMonth, weekInQuarter, quarterOfYear]
        }

        weekCount++
      }
    }

    return [-1, -1, -1, -1]
  }

  getBeginningOfMonthIndex(): number {
    const optionsIndex = this.options.beginningMonthIndex
    if (optionsIndex !== undefined && optionsIndex !== null) {
      return optionsIndex
    } else {
      return 1
    }
  }

  getWeekDistribution(): number[] {
    let weekDistribution: number[]

    switch (this.options.weekGrouping) {
      case WeekGrouping.Group445:
        weekDistribution = [4, 4, 5, 4, 4, 5, 4, 4, 5, 4, 4, 5]
        break
      case WeekGrouping.Group454:
        weekDistribution = [4, 5, 4, 4, 5, 4, 4, 5, 4, 4, 5, 4]
        break
      case WeekGrouping.Group544:
        weekDistribution = [5, 4, 4, 5, 4, 4, 5, 4, 4, 5, 4, 4]
        break
      case WeekGrouping.Group444:
        weekDistribution = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
        break
      case WeekGrouping.Custom:
        // For custom groupings with month-aligned calendars, calculate the distribution dynamically
        weekDistribution = (this.weekDistribution && this.weekDistribution.length > 0) 
          ? this.weekDistribution : 
          this.calculateDynamicWeekDistribution()
        break
    }

    if (
      this.leapYearStrategy === LeapYearStrategy.AddToPenultimateMonth &&
      this.numberOfWeeks === 53
    )
      weekDistribution[weekDistribution.length - 2]++

    if (
      this.leapYearStrategy === LeapYearStrategy.AddToLastMonth &&
      this.numberOfWeeks === 53
    )
      weekDistribution[weekDistribution.length - 1]++

    return weekDistribution
  }

  calculateDynamicWeekDistribution(): number[] {
    // Logic: Each retail month ends on the last occurrence of lastDayOfWeek (e.g., Sunday) in the Gregorian month.
    // The retail month starts the day after the last lastDayOfWeek of the previous Gregorian month.
    // Number of weeks = (lastDayOfWeek of this month - lastDayOfWeek of previous month) / 7
    
    const weekDistribution: number[] = []
    const startingMonthOfYear = this.getBeginningOfMonthIndex() // e.g., 7 for August (0-indexed)
    const lastDayOfWeek = this.options.lastDayOfWeek // e.g., Sunday = 7

    for (let i = 0; i < 12; i++) {
      // Calculate the Gregorian month index (0-11)
      const gregorianMonthIndex = (startingMonthOfYear + i) % 12
      
      // Determine the Gregorian year for this month
      // Before we wrap past December, use calendarYear - 1
      // After we wrap past December, use calendarYear
      let gregorianYear = this.calendarYear - 1
      if (startingMonthOfYear + i >= 12) {
        gregorianYear = this.calendarYear
      }
      
      // Find the last occurrence of lastDayOfWeek in this Gregorian month
      const lastDayOfWeekThisMonth = this.getLastDayOfWeekInMonth(gregorianYear, gregorianMonthIndex, lastDayOfWeek)
      
      // Find the last occurrence of lastDayOfWeek in the previous Gregorian month
      const prevMonthIndex = (gregorianMonthIndex - 1 + 12) % 12
      let prevGregorianYear = gregorianYear
      if (gregorianMonthIndex === 0) {
        // January, so previous month (December) is in previous year
        prevGregorianYear = gregorianYear - 1
      }
      
      const lastDayOfWeekPrevMonth = this.getLastDayOfWeekInMonth(prevGregorianYear, prevMonthIndex, lastDayOfWeek)
      
      // Number of weeks = difference in weeks
      const numWeeks = lastDayOfWeekThisMonth.diff(lastDayOfWeekPrevMonth, 'weeks')
      weekDistribution.push(numWeeks)
    }

    return weekDistribution
  }

  getLastDayOfWeekInMonth(year: number, monthIndex: number, targetDayOfWeek: number): moment.Moment {
    // Get the last day of the month
    const lastDayOfMonth = moment().year(year).month(monthIndex).endOf('month').startOf('day')
    
    // Get the ISO weekday of the last day (1 = Monday, 7 = Sunday)
    const lastDayWeekday = lastDayOfMonth.isoWeekday()
    
    // Calculate how many days to go back to reach the target day of week
    const daysToSubtract = (lastDayWeekday - targetDayOfWeek + 7) % 7
    
    return lastDayOfMonth.subtract(daysToSubtract, 'days')
  }

  getWeekIndex(weekIndex: number): number {
    if (this.numberOfWeeks !== 53) {
      return weekIndex
    }

    switch (this.leapYearStrategy) {
      case LeapYearStrategy.Restated:
        return weekIndex - 1
      case LeapYearStrategy.AddToPenultimateMonth:
        return weekIndex
      case LeapYearStrategy.AddToLastMonth:
        return weekIndex
      default:
        return weekIndex === 52 ? -1 : weekIndex
    }
  }

  calculateLastDayOfYear(year: number): moment.Moment {
    const lastDayOfYear = moment()
      .year(year)
      .month(this.options.lastMonthOfYear)
      .endOf('month')
    const lastIsoWeekDay = this.options.lastDayOfWeek
    const weekCalculation = this.getWeekCalculationStrategy(
      this.options.weekCalculation,
    )
    return weekCalculation.getLastDayForGregorianLastDay(
      lastDayOfYear,
      lastIsoWeekDay,
    )
  }

  calculateNumberOfWeeks(): any {
    // Make sure we get whole day difference
    // by measuring from the end of current year to start of last year
    const lastDayOfYear = this.calculateLastDayOfYear(this.calendarYear).endOf(
      'day',
    )
    const lastDayOfLastYear = this.calculateLastDayOfYear(
      this.calendarYear - 1,
    ).startOf('day')
    const numWeeks = lastDayOfYear.diff(lastDayOfLastYear, 'week')
    return numWeeks
  }

  getWeekCalculationStrategy(
    weekCalculation: WeekCalculation,
  ): LastDayStrategy {
    switch (weekCalculation) {
      case WeekCalculation.LastDayBeforeEOM:
        return new LastDayBeforeEOMStrategy()
      case WeekCalculation.LastDayBeforeEomExceptLeapYear:
        return new LastDayBeforeEOMExceptLeapYearStrategy()
      case WeekCalculation.LastDayNearestEOM:
        return new LastDayNearestEOMStrategy()
      case WeekCalculation.FirstBOWOfFirstMonth:
        return new FirstBOWOfFirstMonth()
      case WeekCalculation.ISO_8601:
        return new LastDayISO8601Strategy()
    }
  }

  getAdjustedGregorianYear(year: number): number {
    if (this.options.lastMonthOfYear !== LastMonthOfYear.December) {
      return year + 1
    } else {
      return year
    }
  }
}
