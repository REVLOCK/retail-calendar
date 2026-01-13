"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var moment_1 = __importDefault(require("moment"));
var types_1 = require("./types");
var calendar_month_1 = require("./calendar_month");
var calendar_week_1 = require("./calendar_week");
var last_day_before_eom_1 = require("./last_day_before_eom");
var last_day_iso_8601_calendar_1 = require("./last_day_iso_8601_calendar");
var last_day_nearest_eom_1 = require("./last_day_nearest_eom");
var first_bow_of_first_month_1 = require("./first_bow_of_first_month");
var last_day_before_eom_except_leap_year_1 = require("./last_day_before_eom_except_leap_year");
exports.RetailCalendarFactory = /** @class */ (function () {
    function Calendar(calendarOptions, year) {
        this.year = year;
        this.weekDistribution = calendarOptions.weekDistribution || [];
        this.options = calendarOptions;
        this.calendarYear = this.getAdjustedGregorianYear(year);
        this.leapYearStrategy = this.getLeapYearStrategy();
        this.numberOfWeeks = this.calculateNumberOfWeeks();
        this.lastDayOfYear = this.calculateLastDayOfYear(this.calendarYear);
        this.firstDayOfYear = moment_1.default(this.lastDayOfYear)
            .subtract(this.numberOfWeeks, 'week')
            .add(1, 'day')
            .startOf('day');
        this.weeks = this.generateWeeks();
        this.months = this.generateMonths();
        this.normalizeMonthOfYearForCustomCalendar();
    }
    Calendar.prototype.normalizeMonthOfYearForCustomCalendar = function () {
        var isCustomCalendar = this.options.weekGrouping === types_1.WeekGrouping.Custom;
        var beginningMonthIndex = this.options.beginningMonthIndex;
        if (isCustomCalendar &&
            beginningMonthIndex !== undefined &&
            beginningMonthIndex !== 1) {
            var offset = beginningMonthIndex - 1;
            // Normalize monthOfYear in weeks
            for (var _i = 0, _a = this.weeks; _i < _a.length; _i++) {
                var week = _a[_i];
                week.monthOfYear = week.monthOfYear - offset;
            }
            // Normalize monthOfYear in months
            for (var _b = 0, _c = this.months; _b < _c.length; _b++) {
                var month = _c[_b];
                month.monthOfYear = month.monthOfYear - offset;
            }
        }
    };
    Calendar.prototype.getLeapYearStrategy = function () {
        if (this.options.restated === undefined &&
            this.options.leapYearStrategy === undefined) {
            throw new Error('One of leapYearStrategy or restated options are required');
        }
        if (this.options.restated !== undefined) {
            // tslint:disable-next-line:no-console
            console.warn('restated option is deprecated. Please use leapYearStrategy instead');
        }
        if (this.options.restated !== undefined &&
            this.options.leapYearStrategy !== undefined) {
            throw new Error('Only one of leapYearStrategy or restated options can be given');
        }
        if (this.options.restated !== undefined && this.options.restated === true) {
            return types_1.LeapYearStrategy.Restated;
        }
        if (this.options.leapYearStrategy !== undefined) {
            return this.options.leapYearStrategy;
        }
        return types_1.LeapYearStrategy.DropLastWeek;
    };
    Calendar.prototype.generateMonths = function () {
        var months = [];
        var beginningIndex = this.getBeginningOfMonthIndex();
        var index = beginningIndex;
        for (var _i = 0, _a = this.getWeekDistribution(); _i < _a.length; _i++) {
            var numberOfWeeks = _a[_i];
            var quarterOfYear = Math.min(Math.floor((index - beginningIndex) / 3) + 1, 4);
            var weeksOfMonth = this.weeks.filter(function (week) { return week.monthOfYear === index; });
            var monthStart = moment_1.default(weeksOfMonth[0].gregorianStartDate);
            var monthEnd = moment_1.default(weeksOfMonth[weeksOfMonth.length - 1].gregorianEndDate);
            months.push(new calendar_month_1.CalendarMonth(index, quarterOfYear, numberOfWeeks, weeksOfMonth, monthStart.toDate(), monthEnd.toDate()));
            index += 1;
        }
        return months;
    };
    Calendar.prototype.generateWeeks = function () {
        var weeks = [];
        for (var index = 0; index < this.numberOfWeeks; index++) {
            var weekIndex = this.getWeekIndex(index);
            var _a = this.getMonthAndWeekOfMonthOfWeek(weekIndex), monthOfYear = _a[0], weekOfMonth = _a[1], weekOfQuarter = _a[2], quarterOfYear = _a[3];
            var start = moment_1.default(this.firstDayOfYear).add(index, 'week');
            var end = moment_1.default(start).add(1, 'week').subtract(1, 'day').endOf('day');
            weeks.push(new calendar_week_1.CalendarWeek(weekIndex, weekOfMonth, weekOfQuarter, monthOfYear, quarterOfYear, start.toDate(), end.toDate()));
        }
        return weeks;
    };
    Calendar.prototype.getMonthAndWeekOfMonthOfWeek = function (weekIndex) {
        var weekDistribution = this.getWeekDistribution();
        var monthOffset = this.getBeginningOfMonthIndex();
        var weeksInQuarter = 0;
        var weekCount = 0;
        var monthOfYear = 0;
        for (var monthIndex = 0; monthIndex < weekDistribution.length; monthIndex++) {
            var weeksInMonth = weekDistribution[monthIndex];
            if (monthIndex % 3 === 0)
                weeksInQuarter = weekDistribution
                    .slice(monthIndex, monthIndex + 3)
                    .reduce(function (a, b) { return a + b; }, 0);
            if (monthIndex === 13)
                weeksInQuarter += weekDistribution[monthIndex];
            monthOfYear = monthIndex + monthOffset;
            for (var weekInMonth = 0; weekInMonth < weeksInMonth; weekInMonth++) {
                if (weekIndex === weekCount) {
                    var weekInQuarter = weekIndex % weeksInQuarter;
                    var quarterOfYear = monthIndex % 3;
                    return [monthOfYear, weekInMonth, weekInQuarter, quarterOfYear];
                }
                weekCount++;
            }
        }
        return [-1, -1, -1, -1];
    };
    Calendar.prototype.getBeginningOfMonthIndex = function () {
        var optionsIndex = this.options.beginningMonthIndex;
        if (optionsIndex !== undefined && optionsIndex !== null) {
            return optionsIndex;
        }
        else {
            return 1;
        }
    };
    Calendar.prototype.getWeekDistribution = function () {
        var weekDistribution;
        switch (this.options.weekGrouping) {
            case types_1.WeekGrouping.Group445:
                weekDistribution = [4, 4, 5, 4, 4, 5, 4, 4, 5, 4, 4, 5];
                break;
            case types_1.WeekGrouping.Group454:
                weekDistribution = [4, 5, 4, 4, 5, 4, 4, 5, 4, 4, 5, 4];
                break;
            case types_1.WeekGrouping.Group544:
                weekDistribution = [5, 4, 4, 5, 4, 4, 5, 4, 4, 5, 4, 4];
                break;
            case types_1.WeekGrouping.Group444:
                weekDistribution = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];
                break;
            case types_1.WeekGrouping.Custom:
                // For custom groupings with month-aligned calendars, calculate the distribution dynamically
                weekDistribution =
                    this.weekDistribution && this.weekDistribution.length > 0
                        ? this.weekDistribution
                        : this.calculateDynamicWeekDistribution();
                break;
        }
        if (this.leapYearStrategy === types_1.LeapYearStrategy.AddToPenultimateMonth &&
            this.numberOfWeeks === 53)
            weekDistribution[weekDistribution.length - 2]++;
        if (this.leapYearStrategy === types_1.LeapYearStrategy.AddToLastMonth &&
            this.numberOfWeeks === 53)
            weekDistribution[weekDistribution.length - 1]++;
        return weekDistribution;
    };
    Calendar.prototype.calculateDynamicWeekDistribution = function () {
        // Logic: Each retail month ends on the last occurrence of lastDayOfWeek (e.g., Sunday) in the Gregorian month.
        // The retail month starts the day after the last lastDayOfWeek of the previous Gregorian month.
        // Number of weeks = (lastDayOfWeek of this month - lastDayOfWeek of previous month) / 7
        var weekDistribution = [];
        var startingMonthOfYear = this.getBeginningOfMonthIndex(); // e.g., 7 for August (0-indexed)
        var lastDayOfWeek = this.options.lastDayOfWeek; // e.g., Sunday = 7
        for (var i = 0; i < 12; i++) {
            // Calculate the Gregorian month index (0-11)
            var gregorianMonthIndex = (startingMonthOfYear + i) % 12;
            // Determine the Gregorian year for this month
            // Before we wrap past December, use calendarYear - 1
            // After we wrap past December, use calendarYear
            var gregorianYear = this.calendarYear - 1;
            if (startingMonthOfYear + i >= 12) {
                gregorianYear = this.calendarYear;
            }
            // Find the last occurrence of lastDayOfWeek in this Gregorian month
            var lastDayOfWeekThisMonth = this.getLastDayOfWeekInMonth(gregorianYear, gregorianMonthIndex, lastDayOfWeek);
            // Find the last occurrence of lastDayOfWeek in the previous Gregorian month
            var prevMonthIndex = (gregorianMonthIndex - 1 + 12) % 12;
            var prevGregorianYear = gregorianYear;
            if (gregorianMonthIndex === 0) {
                // January, so previous month (December) is in previous year
                prevGregorianYear = gregorianYear - 1;
            }
            var lastDayOfWeekPrevMonth = this.getLastDayOfWeekInMonth(prevGregorianYear, prevMonthIndex, lastDayOfWeek);
            // Number of weeks = difference in weeks
            var numWeeks = lastDayOfWeekThisMonth.diff(lastDayOfWeekPrevMonth, 'weeks');
            weekDistribution.push(numWeeks);
        }
        return weekDistribution;
    };
    Calendar.prototype.getLastDayOfWeekInMonth = function (year, monthIndex, targetDayOfWeek) {
        // Get the last day of the month
        var lastDayOfMonth = moment_1.default()
            .year(year)
            .month(monthIndex)
            .endOf('month')
            .startOf('day');
        // Get the ISO weekday of the last day (1 = Monday, 7 = Sunday)
        var lastDayWeekday = lastDayOfMonth.isoWeekday();
        // Calculate how many days to go back to reach the target day of week
        var daysToSubtract = (lastDayWeekday - targetDayOfWeek + 7) % 7;
        return lastDayOfMonth.subtract(daysToSubtract, 'days');
    };
    Calendar.prototype.getWeekIndex = function (weekIndex) {
        if (this.numberOfWeeks !== 53) {
            return weekIndex;
        }
        switch (this.leapYearStrategy) {
            case types_1.LeapYearStrategy.Restated:
                return weekIndex - 1;
            case types_1.LeapYearStrategy.AddToPenultimateMonth:
                return weekIndex;
            case types_1.LeapYearStrategy.AddToLastMonth:
                return weekIndex;
            default:
                return weekIndex === 52 ? -1 : weekIndex;
        }
    };
    Calendar.prototype.calculateLastDayOfYear = function (year) {
        var lastDayOfYear = moment_1.default()
            .year(year)
            .month(this.options.lastMonthOfYear)
            .endOf('month');
        var lastIsoWeekDay = this.options.lastDayOfWeek;
        var weekCalculation = this.getWeekCalculationStrategy(this.options.weekCalculation);
        return weekCalculation.getLastDayForGregorianLastDay(lastDayOfYear, lastIsoWeekDay);
    };
    Calendar.prototype.calculateNumberOfWeeks = function () {
        // Make sure we get whole day difference
        // by measuring from the end of current year to start of last year
        var lastDayOfYear = this.calculateLastDayOfYear(this.calendarYear).endOf('day');
        var lastDayOfLastYear = this.calculateLastDayOfYear(this.calendarYear - 1).startOf('day');
        var numWeeks = lastDayOfYear.diff(lastDayOfLastYear, 'week');
        return numWeeks;
    };
    Calendar.prototype.getWeekCalculationStrategy = function (weekCalculation) {
        switch (weekCalculation) {
            case types_1.WeekCalculation.LastDayBeforeEOM:
                return new last_day_before_eom_1.LastDayBeforeEOMStrategy();
            case types_1.WeekCalculation.LastDayBeforeEomExceptLeapYear:
                return new last_day_before_eom_except_leap_year_1.LastDayBeforeEOMExceptLeapYearStrategy();
            case types_1.WeekCalculation.LastDayNearestEOM:
                return new last_day_nearest_eom_1.LastDayNearestEOMStrategy();
            case types_1.WeekCalculation.FirstBOWOfFirstMonth:
                return new first_bow_of_first_month_1.FirstBOWOfFirstMonth();
            case types_1.WeekCalculation.ISO_8601:
                return new last_day_iso_8601_calendar_1.LastDayISO8601Strategy();
        }
    };
    Calendar.prototype.getAdjustedGregorianYear = function (year) {
        if (this.options.lastMonthOfYear !== types_1.LastMonthOfYear.December) {
            return year + 1;
        }
        else {
            return year;
        }
    };
    return Calendar;
}());
