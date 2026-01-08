"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var moment_1 = __importDefault(require("moment"));
var types_1 = require("./types");
var LastDayISO8601Strategy = /** @class */ (function () {
    function LastDayISO8601Strategy() {
    }
    LastDayISO8601Strategy.prototype.getLastDayForGregorianLastDay = function (lastDayOfGregorianYear, lastDayOfIsoWeek) {
        if (lastDayOfGregorianYear.month() === types_1.LastMonthOfYear.December) {
            // Step 1: Get Jan 4 of the *next* Gregorian year
            var jan4NextYear = moment_1.default(lastDayOfGregorianYear.year() + 1 + "-01-04");
            // Step 2: Go to ISO week 1 of next year,
            // then subtract 1 week to get the *last week* of current ISO year
            var lastIsoWeek = jan4NextYear.isoWeek(1).subtract(1, 'week');
            // Step 3: Move to the desired ISO weekday (default is Sunday = 7)
            return lastIsoWeek.isoWeekday(lastDayOfIsoWeek);
        }
        else {
            // NEW LOGIC: Only return last occurrence of weekday in this month on or before lastDayOfGregorianYear
            var candidate = lastDayOfGregorianYear
                .clone()
                .isoWeekday(lastDayOfIsoWeek);
            // If candidate is after lastDayOfGregorianYear, go one week back
            if (candidate.isAfter(lastDayOfGregorianYear)) {
                candidate.subtract(7, 'days');
            }
            // Ensure candidate is in the same month
            if (candidate.month() !== lastDayOfGregorianYear.month()) {
                // If it's not, go back one more week
                candidate.subtract(7, 'days');
            }
            return candidate;
        }
    };
    return LastDayISO8601Strategy;
}());
exports.LastDayISO8601Strategy = LastDayISO8601Strategy;
