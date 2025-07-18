import { RetailCalendarFactory } from '../src/retail_calendar'
import {
  RetailCalendarOptions,
  WeekGrouping,
  LastDayOfWeek,
  LastMonthOfYear,
  WeekCalculation,
  NRFCalendarOptions,
  LeapYearStrategy,
  RetailCalendar,
} from '../src/types'
import { nrfYears } from './data/nrf_years'
import { lastDayBeforeEOMYears } from './data/last_day_before_eom_years'
import { nrf2018, nrf2017Restated } from './data/nrf_2018'
import { firstBow } from './data/first_bow'
import moment from 'moment'
import { lastDayBeforeEomExceptLeapYear } from './data/last_day_before_eom_except_leap_year';
import { group_444_saturday } from './data/group_444_saturday';
import { group_444_sunday } from './data/group_444_sunday';
import { group_444_friday } from './data/group_444_friday';
import { group_444_march_saturday } from './data/group_444_march_saturday';

const DayComparisonFormat = 'YYYY-MM-DD'

describe('RetailCalendar', () => {
  describe("leap year strategy options", () => {

    describe('when neither restated nor leapYearStrategy is provided', () => {
      it('throws an error', () => {
        expect(() => {
          new RetailCalendarFactory({
            weekGrouping: WeekGrouping.Group454,
            lastDayOfWeek: LastDayOfWeek.Saturday,
            lastMonthOfYear: LastMonthOfYear.January,
            weekCalculation: WeekCalculation.LastDayNearestEOM,
          }, 2018)
        }).toThrowError(/leapYearStrategy or restated/)
      })
    })

    describe("when restated is provided and its true", () => {
      it("emits a warning", () => {
        jest.spyOn(console, 'warn').mockImplementation()
        const retailCalendar = new RetailCalendarFactory({
          weekGrouping: WeekGrouping.Group454,
          lastDayOfWeek: LastDayOfWeek.Saturday,
          lastMonthOfYear: LastMonthOfYear.January,
          weekCalculation: WeekCalculation.LastDayNearestEOM, 
          restated: true
        }, 2017)

        expect(retailCalendar.leapYearStrategy).toBe(LeapYearStrategy.Restated)
        expect(console.warn).toHaveBeenCalledWith("restated option is deprecated. Please use leapYearStrategy instead")
      })
    })

    describe("when restated is provided and its false", () => {
      it("emits a warning", () => {
        jest.spyOn(console, 'warn').mockImplementation()
        const retailCalendar = new RetailCalendarFactory({
          weekGrouping: WeekGrouping.Group454,
          lastDayOfWeek: LastDayOfWeek.Saturday,
          lastMonthOfYear: LastMonthOfYear.January,
          weekCalculation: WeekCalculation.LastDayNearestEOM,
          restated: false
        }, 2017)

        expect(retailCalendar.leapYearStrategy).toBe(LeapYearStrategy.DropLastWeek)
        expect(console.warn).toHaveBeenCalledWith("restated option is deprecated. Please use leapYearStrategy instead")
      })
    })

    describe("when restated and leapYearStrategy are provided", () => {
      it('throws an erorr', () => {
        expect(() => {
          jest.spyOn(console, 'warn').mockImplementation()
          const retailCalendar = new RetailCalendarFactory({
            weekGrouping: WeekGrouping.Group454,
            lastDayOfWeek: LastDayOfWeek.Saturday,
            lastMonthOfYear: LastMonthOfYear.January,
            weekCalculation: WeekCalculation.LastDayNearestEOM,
            leapYearStrategy: LeapYearStrategy.Restated,
            restated: false
          }, 2017)
        }).toThrowError(/Only one of leapYearStrategy or restated options can be given/)
      })

    })
  })

  describe('given NRF calendar options', () => {
    it('numberOfWeeks calculates properly for each year', () => {
      for (const { year, numberOfWeeks } of nrfYears) {
        const calendar = new RetailCalendarFactory(NRFCalendarOptions, year)
        expect(calendar.numberOfWeeks).toBe(numberOfWeeks)
      }
    })

    it('returns months with correct number of weeks', () => {
      const calendar = new RetailCalendarFactory(NRFCalendarOptions, 2018)
      const months = calendar.months
      const expectedMonthLenthsInWeeks = [4, 5, 4, 4, 5, 4, 4, 5, 4, 4, 5, 4]
      expect(months.length).toBe(12)
      expect(months.map((month) => month.weeks.length)).toEqual(
        expectedMonthLenthsInWeeks,
      )
    })

    it('returns month with correct start and end dates', () => {
      const calendar = new RetailCalendarFactory(NRFCalendarOptions, 2018)
      for (let index = 0; index < 12; index++) {
        const month = calendar.months[index]
        const nrfMonth = nrf2018[index]
        expect(month.gregorianStartDate.getTime()).toEqual(
          moment(nrfMonth.start).startOf('day').toDate().getTime(),
        )

        expect(month.gregorianEndDate.getTime()).toEqual(
          moment(nrfMonth.end).endOf('day').toDate().getTime(),
        )
      }
    })

    it('returns start date and end of first month on leap years', () => {
      const calendar = new RetailCalendarFactory(NRFCalendarOptions, 2017)
      const monthIndex = 0
      const month = calendar.months[monthIndex]
      const nrfMonth = nrf2017Restated[monthIndex]
      expect(month.gregorianStartDate.getTime()).toEqual(
        moment(nrfMonth.start).startOf('day').toDate().getTime(),
      )
      expect(month.gregorianEndDate.getTime()).toEqual(
        moment(nrfMonth.end).endOf('day').toDate().getTime(),
      )
    })

    it('returns weeks with corect month', () => {
      const calendar = new RetailCalendarFactory(NRFCalendarOptions, 2018)
      const weeks = calendar.weeks
      // 4, 5, 4 calendar
      const monthOfYearByWeek = [
        ...Array.from({ length: 4 }).fill(1), // First 4 weeks in 1st month
        ...Array.from({ length: 5 }).fill(2), // Then 5 weeks in 2nd month
        ...Array.from({ length: 4 }).fill(3), // Then 4 weeks in 3rd month,
        // this pattern repeats for other quarters
        ...Array.from({ length: 4 }).fill(4),
        ...Array.from({ length: 5 }).fill(5),
        ...Array.from({ length: 4 }).fill(6),
        ...Array.from({ length: 4 }).fill(7),
        ...Array.from({ length: 5 }).fill(8),
        ...Array.from({ length: 4 }).fill(9),
        ...Array.from({ length: 4 }).fill(10),
        ...Array.from({ length: 5 }).fill(11),
        ...Array.from({ length: 4 }).fill(12),
      ]
      for (let index = 0; index < weeks.length; index++) {
        expect(weeks[index].monthOfYear).toBe(monthOfYearByWeek[index])
      }
    })

    it('returns weeks with corect start and end dates', () => {
      const calendar = new RetailCalendarFactory(NRFCalendarOptions, 2018)
      const weeks = calendar.weeks
      expect(weeks[0].gregorianStartDate.getTime()).toEqual(
        moment('2018-02-04').toDate().getTime(),
      )
      expect(weeks[0].gregorianEndDate.getTime()).toEqual(
        moment('2018-02-10').endOf('day').toDate().getTime(),
      )

      expect(weeks[1].gregorianStartDate.getTime()).toEqual(
        moment('2018-02-11').toDate().getTime(),
      )
      expect(weeks[1].gregorianEndDate.getTime()).toEqual(
        moment('2018-02-17').endOf('day').toDate().getTime(),
      )
    })

    it('returns quarters', () => {
      const calendar = new RetailCalendarFactory(NRFCalendarOptions, 2018)
      const months = calendar.months
      const weeks = calendar.weeks
      expect(months[0].quarterOfYear).toEqual(1)
      expect(months[1].quarterOfYear).toEqual(1)
      expect(months[2].quarterOfYear).toEqual(1)
      expect(months[3].quarterOfYear).toEqual(2)
      expect(months[4].quarterOfYear).toEqual(2)
      expect(months[5].quarterOfYear).toEqual(2)
      expect(months[6].quarterOfYear).toEqual(3)
      expect(months[7].quarterOfYear).toEqual(3)
      expect(months[8].quarterOfYear).toEqual(3)
      expect(months[9].quarterOfYear).toEqual(4)
      expect(months[10].quarterOfYear).toEqual(4)
      expect(months[11].quarterOfYear).toEqual(4)

      expect(weeks[0].weekOfQuarter).toEqual(0)
      expect(weeks[13].weekOfQuarter).toEqual(0)
      expect(weeks[26].weekOfQuarter).toEqual(0)
      expect(weeks[39].weekOfQuarter).toEqual(0)
      expect(weeks[51].weekOfQuarter).toEqual(12)
    })

    describe('on leap years', () => {
      describe('when restated', () => {
        it('does not assign any months to first week', () => {
          const calendar = new RetailCalendarFactory(NRFCalendarOptions, 2017)
          const firstWeek = calendar.weeks[0]
          expect(firstWeek.monthOfYear).toBe(-1)
          expect(firstWeek.weekOfMonth).toBe(-1)
          expect(firstWeek.weekOfYear).toBe(-1)
          expect(firstWeek.weekOfQuarter).toBe(-1)

          const secondWeekInYear = calendar.weeks[1]
          expect(secondWeekInYear.weekOfYear).toBe(0)

          const firstMonth = calendar.months[0]
          expect(firstMonth.weeks[0]).not.toEqual(firstWeek)
          expect(firstMonth.weeks[0].weekOfYear).toEqual(0)
        })
      })

      describe('when inserting a week in penultimate month', () => {
        let calendar: RetailCalendar;

        beforeEach(() => {
          calendar = new RetailCalendarFactory(
            { ...NRFCalendarOptions, weekGrouping: WeekGrouping.Group445, leapYearStrategy: LeapYearStrategy.AddToPenultimateMonth },
            2017,
          )
        })
        it('keeps the first week in the year', () => {
          const firstWeek = calendar.weeks[0]
          expect(firstWeek.monthOfYear).toBe(1)
          expect(firstWeek.weekOfMonth).toBe(0)
          expect(firstWeek.weekOfYear).toBe(0)
          expect(firstWeek.weekOfQuarter).toBe(0)
          const firstMonth = calendar.months[0]
          expect(firstMonth.weeks[0]).toEqual(firstWeek)
          expect(firstMonth.weeks[0].weekOfYear).toEqual(0)
        })
        it('keeps the last week in the year', () => {
          const lastWeek = calendar.weeks[52]
          expect(lastWeek.monthOfYear).toBe(12)
          expect(lastWeek.weekOfMonth).toBe(4)
          expect(lastWeek.weekOfYear).toBe(52)
        })
        it('adds a week to the 11th month', () => {
          const expectedMonthLengthsInWeeks = [4, 4, 5, 4, 4, 5, 4, 4, 5, 4, 5, 5]
          const actualMonthLengthsInWeeks = calendar.months.map((month) => month.weeks.length)

          expect(expectedMonthLengthsInWeeks).toEqual(actualMonthLengthsInWeeks)

          const secondWeekInYear = calendar.weeks[1]
          expect(secondWeekInYear.weekOfYear).toBe(1)

        })
      })

      describe('when inserting a week in leap year last month', () => {
        let calendar: RetailCalendar;

        beforeEach(() => {
          calendar = new RetailCalendarFactory(
              { ...NRFCalendarOptions, weekGrouping: WeekGrouping.Group445, leapYearStrategy: LeapYearStrategy.AddToLastMonth },
              2017,
          )
        })
        it('keeps the first week in the year', () => {
          const firstWeek = calendar.weeks[0]
          expect(firstWeek.monthOfYear).toBe(1)
          expect(firstWeek.weekOfMonth).toBe(0)
          expect(firstWeek.weekOfYear).toBe(0)
          expect(firstWeek.weekOfQuarter).toBe(0)
          const firstMonth = calendar.months[0]
          expect(firstMonth.weeks[0]).toEqual(firstWeek)
          expect(firstMonth.weeks[0].weekOfYear).toEqual(0)
        })
        it('keeps the last week in the year', () => {
          const lastWeek = calendar.weeks[52]
          expect(lastWeek.monthOfYear).toBe(12)
          expect(lastWeek.weekOfMonth).toBe(5) // 6 weeks in the month
          expect(lastWeek.weekOfYear).toBe(52)
        })

        it('adds a week to the 12th month', () => {
          const expectedMonthLengthsInWeeks = [4, 4, 5, 4, 4, 5, 4, 4, 5, 4, 4, 6]
          const actualMonthLengthsInWeeks = calendar.months.map((month) => month.weeks.length)

          expect(expectedMonthLengthsInWeeks).toEqual(actualMonthLengthsInWeeks)

          const secondWeekInYear = calendar.weeks[1]
          expect(secondWeekInYear.weekOfYear).toBe(1)

        })
      })

      describe('when not restated', () => {
        it('does not assign any months to last week', () => {
          const calendar = new RetailCalendarFactory(
            { ...NRFCalendarOptions, leapYearStrategy: LeapYearStrategy.DropLastWeek },
            2017,
          )
          const lastWeek = calendar.weeks[52]
          expect(lastWeek.monthOfYear).toBe(-1)
          expect(lastWeek.weekOfMonth).toBe(-1)
          expect(lastWeek.weekOfYear).toBe(-1)

          const firstMonth = calendar.months[0]
          expect(firstMonth.weeks[0].weekOfYear).toEqual(0)

          const lastMonth = calendar.months[11]
          expect(lastMonth.weeks[3]).not.toEqual(lastWeek)
          expect(lastMonth.weeks[3]).toEqual(calendar.weeks[51])
        })
      })
    })
  })

  describe('given saturday nearest end of month option', () => {
    it('numberOfWeeks calculates properly for each year', () => {
      const calendarOptions: RetailCalendarOptions = {
        weekGrouping: WeekGrouping.Group454,
        lastDayOfWeek: LastDayOfWeek.Saturday,
        lastMonthOfYear: LastMonthOfYear.August,
        weekCalculation: WeekCalculation.LastDayBeforeEOM,
        leapYearStrategy: LeapYearStrategy.DropLastWeek
      }

      for (const { year, numberOfWeeks } of lastDayBeforeEOMYears) {
        const calendar = new RetailCalendarFactory(calendarOptions, year)
        expect(calendar.numberOfWeeks).toBe(numberOfWeeks)
      }
    })

    describe('given 544 week grouping', () => {
      it('distributes weeks in 5 4 4 per month in each quarter', () => {
        const calendarOptions: RetailCalendarOptions = {
          weekGrouping: WeekGrouping.Group544,
          lastDayOfWeek: LastDayOfWeek.Saturday,
          lastMonthOfYear: LastMonthOfYear.August,
          weekCalculation: WeekCalculation.LastDayBeforeEOM,
          leapYearStrategy: LeapYearStrategy.DropLastWeek
        }
        const calendar = new RetailCalendarFactory(calendarOptions, 2015)
        const expectedMonthLenthsInWeeks = [5, 4, 4, 5, 4, 4, 5, 4, 4, 5, 4, 4]
        expect(calendar.months.length).toBe(12)
        expect(calendar.months.map((month) => month.weeks.length)).toEqual(
          expectedMonthLenthsInWeeks,
        )
      })
    })

    describe('given 445 week grouping', () => {
      it('distributes weeks in 4 4 5 per month in each quarter', () => {
        const calendarOptions: RetailCalendarOptions = {
          weekGrouping: WeekGrouping.Group445,
          lastDayOfWeek: LastDayOfWeek.Saturday,
          lastMonthOfYear: LastMonthOfYear.August,
          weekCalculation: WeekCalculation.LastDayBeforeEOM,
          leapYearStrategy: LeapYearStrategy.DropLastWeek
        }
        const calendar = new RetailCalendarFactory(calendarOptions, 2015)
        const expectedMonthLenthsInWeeks = [4, 4, 5, 4, 4, 5, 4, 4, 5, 4, 4, 5]
        expect(calendar.months.length).toBe(12)
        expect(calendar.months.map((month) => month.weeks.length)).toEqual(
          expectedMonthLenthsInWeeks,
        )
      })
    })
  })
  describe('given December as last month of year', () => {
    it('the gregorian year ends in December of the given year', () => {
      const options = {
        weekGrouping: WeekGrouping.Group445,
        lastDayOfWeek: LastDayOfWeek.Saturday,
        lastMonthOfYear: LastMonthOfYear.December,
        weekCalculation: WeekCalculation.LastDayNearestEOM,
        leapYearStrategy: LeapYearStrategy.Restated
      }
      const calendar = new RetailCalendarFactory(options, 2019)
      expect(calendar.months[11].gregorianStartDate.getFullYear()).toBe(2019)
    })
  })

  describe('given first end of week of first month strategy', () => {
    it('returns month with correct start and end dates', () => {
      const options = {
        weekGrouping: WeekGrouping.Group445,
        lastDayOfWeek: LastDayOfWeek.Saturday,
        lastMonthOfYear: LastMonthOfYear.December,
        weekCalculation: WeekCalculation.FirstBOWOfFirstMonth,
        leapYearStrategy: LeapYearStrategy.Restated
      }

      for (const yearData of firstBow) {
        const calendar = new RetailCalendarFactory(options, yearData.year)
        for (const month of yearData.months) {
          const calendarMonth = calendar.months[month.monthOfYear]
          expect(calendarMonth.gregorianStartDate.getTime()).toEqual(
            moment(month.start).startOf('day').toDate().getTime(),
          )
          expect(calendarMonth.gregorianEndDate.getTime()).toEqual(
            moment(month.end).endOf('day').toDate().getTime(),
          )
        }
      }
    })
  })

  describe('given beginning month index option', () => {
    it('returns correct monthOfYear value for each month and week', () => {
      const calendar = new RetailCalendarFactory({...NRFCalendarOptions, beginningMonthIndex: 0}, 2018)
      const weeks = calendar.weeks
      // 4, 5, 4 calendar
      const monthOfYearByWeek = [
        ...Array.from({ length: 4 }).fill(0), // First 4 weeks in 1st month
        ...Array.from({ length: 5 }).fill(1), // Then 5 weeks in 2nd month
        ...Array.from({ length: 4 }).fill(2), // Then 4 weeks in 3rd month,
        // this pattern repeats for other quarters
        ...Array.from({ length: 4 }).fill(3),
        ...Array.from({ length: 5 }).fill(4),
        ...Array.from({ length: 4 }).fill(5),
        ...Array.from({ length: 4 }).fill(6),
        ...Array.from({ length: 5 }).fill(7),
        ...Array.from({ length: 4 }).fill(8),
        ...Array.from({ length: 4 }).fill(9),
        ...Array.from({ length: 5 }).fill(10),
        ...Array.from({ length: 4 }).fill(11),
      ]
      for (let index = 0; index < weeks.length; index++) {
        expect(weeks[index].monthOfYear).toBe(monthOfYearByWeek[index])
      }
      for (let index = 0; index < calendar.months.length; index++) {
        expect(calendar.months[index].monthOfYear).toBe(index)
      }
    })

    it('returns correct quarterOfYear value for each month', () => {
      const calendar = new RetailCalendarFactory({...NRFCalendarOptions, beginningMonthIndex: 0}, 2018)
      const months= calendar.months
      expect(months[0].quarterOfYear).toBe(1)
      expect(months[1].quarterOfYear).toBe(1)
      expect(months[2].quarterOfYear).toBe(1)

      expect(months[3].quarterOfYear).toBe(2)
      expect(months[4].quarterOfYear).toBe(2)
      expect(months[5].quarterOfYear).toBe(2)

      expect(months[6].quarterOfYear).toBe(3)
      expect(months[7].quarterOfYear).toBe(3)
      expect(months[8].quarterOfYear).toBe(3)

      expect(months[9].quarterOfYear).toBe(4)
      expect(months[10].quarterOfYear).toBe(4)
      expect(months[11].quarterOfYear).toBe(4)
    })
  })

  describe('given "last day nearest end of month except restated" week calculation method', ()=> {

    it('it moves 53rd week to previous year', ()=> {
      const options = {
        weekGrouping: WeekGrouping.Group445,
        lastDayOfWeek: LastDayOfWeek.Saturday,
        lastMonthOfYear: LastMonthOfYear.December,
        weekCalculation: WeekCalculation.LastDayBeforeEomExceptLeapYear,
        leapYearStrategy: LeapYearStrategy.DropLastWeek
      }
    
      for (const yearData of lastDayBeforeEomExceptLeapYear) {
        const calendar = new RetailCalendarFactory(options, yearData.year)
        for (const month of yearData.months) {
          const calendarMonth = calendar.months[month.monthOfYear]
          expect(moment(calendarMonth.gregorianStartDate).format(DayComparisonFormat))
            .toEqual(month.start)
          expect(moment(calendarMonth.gregorianEndDate).format(DayComparisonFormat)).toEqual(
            month.end
          )
        }
        if(yearData.leapWeek) {
          const leapWeek = calendar.weeks[52]
          expect(moment(leapWeek.gregorianStartDate).format(DayComparisonFormat))
            .toEqual(yearData.leapWeek.start)
          expect(moment(leapWeek.gregorianEndDate).format(DayComparisonFormat))
            .toEqual(yearData.leapWeek.end)
        }
      }
      
    })
  })

  describe('given group 444 with 13 period calendar config ends saturday', ()=> {

    it('it matches example calendar', ()=> {
      const options = {
        weekGrouping: WeekGrouping.Group444,
        lastDayOfWeek: LastDayOfWeek.Saturday,
        lastMonthOfYear: LastMonthOfYear.December,
        weekCalculation: WeekCalculation.ISO_8601,
        leapYearStrategy: LeapYearStrategy.AddToLastMonth
      }
    
      for (const yearData of group_444_saturday) {
        const calendar = new RetailCalendarFactory(options, yearData.year)
        expect(calendar.numberOfWeeks).toEqual(yearData.numberOfWeeks)
        for (const month of yearData.months) {
          const calendarMonth = calendar.months[month.monthOfYear]
          expect(moment(calendarMonth.gregorianStartDate).format(DayComparisonFormat))
            .toEqual(month.start)
          expect(moment(calendarMonth.gregorianEndDate).format(DayComparisonFormat)).toEqual(
            month.end
          )
        }
      }
    })
  })

  describe('given group 444 with 13 period calendar config ends sunday', ()=> {

    it('it matches example calendar', ()=> {
      const options = {
        weekGrouping: WeekGrouping.Group444,
        lastDayOfWeek: LastDayOfWeek.Sunday,
        lastMonthOfYear: LastMonthOfYear.December,
        weekCalculation: WeekCalculation.ISO_8601,
        leapYearStrategy: LeapYearStrategy.AddToLastMonth
      }
    
      for (const yearData of group_444_sunday) {
        const calendar = new RetailCalendarFactory(options, yearData.year)
        expect(calendar.numberOfWeeks).toEqual(yearData.numberOfWeeks)
        for (const month of yearData.months) {
          const calendarMonth = calendar.months[month.monthOfYear]
          expect(moment(calendarMonth.gregorianStartDate).format(DayComparisonFormat))
            .toEqual(month.start)
          expect(moment(calendarMonth.gregorianEndDate).format(DayComparisonFormat)).toEqual(
            month.end
          )
        }
      }
    })
  })

  describe('given group 444 with 13 period calendar config ends friday', ()=> {

    it('it matches example calendar', ()=> {
      const options = {
        weekGrouping: WeekGrouping.Group444,
        lastDayOfWeek: LastDayOfWeek.Friday,
        lastMonthOfYear: LastMonthOfYear.December,
        weekCalculation: WeekCalculation.ISO_8601,
        leapYearStrategy: LeapYearStrategy.AddToLastMonth
      }
    
      for (const yearData of group_444_friday) {
        const calendar = new RetailCalendarFactory(options, yearData.year)
        expect(calendar.numberOfWeeks).toEqual(yearData.numberOfWeeks)
        for (const month of yearData.months) {
          const calendarMonth = calendar.months[month.monthOfYear]
          expect(moment(calendarMonth.gregorianStartDate).format(DayComparisonFormat))
            .toEqual(month.start)
          expect(moment(calendarMonth.gregorianEndDate).format(DayComparisonFormat)).toEqual(
            month.end
          )
        }
      }
    })
  })

  describe.only('given group 444 with 13 period calendar config ends march last saturday', ()=> {

    it('it matches example calendar', ()=> {
      const options = {
        weekGrouping: WeekGrouping.Group444,
        lastDayOfWeek: LastDayOfWeek.Saturday,
        lastMonthOfYear: LastMonthOfYear.March,
        weekCalculation: WeekCalculation.ISO_8601,
        leapYearStrategy: LeapYearStrategy.AddToLastMonth
      }
      
      for (const yearData of group_444_march_saturday) {
        const calendar = new RetailCalendarFactory(options, yearData.year)
        expect(calendar.numberOfWeeks).toEqual(yearData.numberOfWeeks)
        for (const month of yearData.months) {
          const calendarMonth = calendar.months[month.monthOfYear]
          expect(moment(calendarMonth.gregorianStartDate).format(DayComparisonFormat))
            .toEqual(month.start)
          expect(moment(calendarMonth.gregorianEndDate).format(DayComparisonFormat)).toEqual(
            month.end
          )
        }
      }
    })
  })
})
