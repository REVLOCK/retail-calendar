"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var retail_calendar_1 = require("./retail_calendar");
function weekOfGregorianDate(date, calendarOptions) {
    var year = date.getFullYear();
    var candidateYears = [year - 1, year, year + 1];
    for (var _i = 0, candidateYears_1 = candidateYears; _i < candidateYears_1.length; _i++) {
        var candiateYear = candidateYears_1[_i];
        var calendar = new retail_calendar_1.RetailCalendarFactory(calendarOptions, candiateYear);
        var week = calendar.weeks.find(function (calendarWeek) {
            return calendarWeek.gregorianStartDate <= date &&
                calendarWeek.gregorianEndDate >= date;
        });
        if (week) {
            return {
                calendar: calendar,
                week: week,
            };
        }
    }
    throw new Error("No retail calendar week found for " + date.toDateString() + ". This should never be the case. Please report this to calendar authorities.");
}
exports.weekOfGregorianDate = weekOfGregorianDate;
