"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CalendarMonth = /** @class */ (function () {
    function CalendarMonth(monthOfYear, quarterOfYear, numberOfWeeks, weeks, gregorianStartDate, gregorianEndDate) {
        this.monthOfYear = monthOfYear;
        this.quarterOfYear = quarterOfYear;
        this.numberOfWeeks = numberOfWeeks;
        this.weeks = weeks;
        this.gregorianStartDate = gregorianStartDate;
        this.gregorianEndDate = gregorianEndDate;
    }
    return CalendarMonth;
}());
exports.CalendarMonth = CalendarMonth;
